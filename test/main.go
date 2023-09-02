package main

import (
	"log"
	"net/http"

	wsync "github.com/simbafs/wsync/handler"
)

func main() {
	http.Handle("/ws", wsync.New())

	log.Fatal(http.ListenAndServe(":3000", nil))
}
