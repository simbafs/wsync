package wsync

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/simbafs/wsync/handler/websocket"
)

// Storage is a interface to manipulate underlying kv storage like db or json file
type Storage interface {
	Set(string, string) error
	Get(string) (string, error)
	Remove(string) error
	Key() ([]string, error)
}

type Wsync struct {
	// Hub maintains clients
	Hub *websocket.Hub
	// IO wrap websocket.Hub to support some socket.io feature
	IO *websocket.IO
	// Storage store server state
	Storage Storage
	// http handler to return all states
	All http.HandlerFunc
}

func (ws *Wsync) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
	// upgrade to websocket

	if key := r.URL.Query().Get("key"); key != "" {
		value, err := ws.Storage.Get(key)
		if err != nil {
			fmt.Fprintf(w, "get value from key: %s", err)
		}

		fmt.Fprintf(w, value)
		return
	}

	websocket.ServeWs(ws.Hub, w, r)
}

type wsData struct {
	// Op    string `json:"op"`
	Key   string `json:"key"`
	Value string `json:"value"`
}

func New(storage Storage) *Wsync {
	hub := websocket.NewHub(func(from *websocket.Client, in []byte, out chan []byte) {
		if string(in[:4]) == "updt" {
			data := wsData{}
			if err := json.Unmarshal(in[4:], &data); err != nil {
				from.Send <- []byte(fmt.Sprintf("mesgerror occur when parse json"))
				return
			}
			if err := storage.Set(data.Key, data.Value); err != nil {
				from.Send <- []byte(fmt.Sprintf("mesgerror occur when store data"))
				return

			}
			out <- in
		}
	})
	go hub.Run()
	all := func(w http.ResponseWriter, r *http.Request) {
		// return all data
		keys, err := storage.Key()
		if err != nil {
			fmt.Fprintf(w, "get keys: %s", err)
			return
		}

		result := map[string]string{}
		for _, key := range keys {
			value, err := storage.Get(key)
			if err != nil {
				fmt.Fprintf(w, "iterate in keys: %s", err)
				return
			}

			result[key] = value
		}

		data, err := json.Marshal(result)
		if err != nil {
			fmt.Fprintf(w, "marshal data: %s", err)
			return
		}

		w.Header().Add("Content-Type", "application/json")
		fmt.Fprintf(w, string(data))
		return
	}

	return &Wsync{
		Hub:     hub,
		IO:      websocket.NewIO(hub),
		Storage: storage,
		All:     all,
	}
}
