package websocket

type HubProcessor func(*Client, []byte, chan []byte)

type Hub struct {
	clients    map[string]*Client
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	processor  HubProcessor
}

func NewHub(handler HubProcessor) *Hub {
	if handler == nil {
		handler = func(from *Client, in []byte, out chan []byte) {
			switch string(in[:4]) {
			case "ping":
				from.Send <- []byte("pong")
			default:
				out <- in
			}
		}
	}

	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]*Client),
		processor:  handler,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case conn := <-h.register:
			h.clients[conn.ID] = conn
		case conn := <-h.unregister:
			delete(h.clients, conn.ID)
			close(conn.Send)
		case message := <-h.broadcast:
			for _, conn := range h.clients {
				select {
				case conn.Send <- message:
				default:
					close(conn.Send)
					delete(h.clients, conn.ID)
				}
			}
		}
	}
}
