// modified from https://github.com/gorilla/websocket/blob/main/examples/chat
package websocket

import (
	"log"
	"math/rand"
	"net/http"
	"time"

	gwebsocket "github.com/gorilla/websocket"
)

var upgrader = gwebsocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

// ServeWs handles websocket requests from the peer.
func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := NewClient(hub, conn)

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
