package wsync

import (
	"fmt"
	"net/http"
)

type Wsync struct{}

func (ws *Wsync) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// upgrade to websocket
	fmt.Fprintf(w, "<h1>hello world</h1>")
}

func New() *Wsync {
	return new(Wsync)
}
