# wsync

Wsync is a package designed to synchronize states between the server and the browser using WebSockets. This package includes a handler for creating a Go HTTP server and provides helpers for vanilla JS. Support for React hooks is currently under development. For detailed usage examples, please visit the [example/vanilla](./example/vanilla/) directory.

> [!IMPORTANT]  
> This project is in its very early stages, so please note that everything is subject to change with each new commit. I will do my utmost to keep this README updated promptly.

## vanilla

> [!WARNING]  
> `wsync.syncElement` change in the feature.

```go
func main() {
	ws := wsync.New(mapstorage.New())
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.Handle("/ws", ws)
	http.Handle("/all", ws.All)

	log.Fatal(http.ListenAndServe(":3000", nil))
}
```

```html
<input type="checkbox" data-wsync-key="checkbox" />
<input type="color" data-wsync-key="color" />
<input type="datetime-local" data-wsync-key="datetimeLocal" />
<input type="number" data-wsync-key="number" />
<input type="range" data-wsync-key="range" />
<input type="text" data-wsync-key="text" />
<script type="module">
	import init from '/hook/vanilla.js'

	// init() will init websocket connection and than sync all element with `data-wsync-key` if the second parameter is true
	init('ws://localhost:3000/ws', true)
</script>
```

## react

> [!NOTE]  
> `useWsReducer` is in progress

```js
function App() {
	const wsync = useWsync('ws://localhost:3000/ws')
	const [count, setCount] = useWsState(wsync, 'count', 0)

	return (
		<>
			<p>{count}</p>
			<button onClick={() => setCount(c => c + 1)}>Add</button>
		</>
	)
}
```
