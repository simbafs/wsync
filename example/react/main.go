package main

import (
	"log"
	"net/http"

	wsync "github.com/simbafs/wsync/handler"
	mapstorage "github.com/simbafs/wsync/handler/mapStorage"
)

func main() {
	ws := wsync.New(mapstorage.New())
	http.Handle("/ws", ws)
	http.Handle("/get", ws.Get)

	log.Fatal(http.ListenAndServe(":3000", nil))
}
