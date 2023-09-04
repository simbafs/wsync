package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	wsync "github.com/simbafs/wsync/handler"
	mapstorage "github.com/simbafs/wsync/handler/mapStorage"
)

func main() {
	handler := http.NewServeMux()
	ws := wsync.New(mapstorage.New())
	handler.Handle("/ws", ws)
	handler.Handle("/get", ws.Get)

	remote, _ := url.Parse("http://localhost:5173")
	handler.Handle("/", httputil.NewSingleHostReverseProxy(remote))

	log.Fatal(http.ListenAndServe(":3000", handler))
}
