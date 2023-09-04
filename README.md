# wsync

Wsync is a package designed to synchronize states between the server and the browser using WebSockets. This package includes a handler for creating a Go HTTP server and provides helpers for vanilla JS. Support for React hooks is currently under development. For detailed usage examples, please visit the [example/vanilla](./example/vanilla/) directory.

## vanilla

> [!WARNING]  
> `wsync.syncElement` change in the feature

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
<input type="number" data-wsync-key="count" />
<script type="module">
	import init from '/hook/vanilla.js'

	const { wsync } = init('wss://localhost:3000/ws')

	wsync.syncElement(document.querySelector('[data-wsync-key]'), 'value')
</script>
```

## react

> [!NOTE]  
> `useWsReducer` is in progress

```js
function App() {
	const [wsync, setWsync] = useState(null)
	const [count, setCount] = useWsState(wsync, 'count', 0)

	useEffect(() => {
		const { wsync, clear } = init('ws://localhost:3000/ws')
		setWsync(wsync)
		return clear
	}, [])

	return (
		<>
			<p>{count}</p>
			<button onClick={() => setCount(c => +c + 1 + '')}>Add</button>
		</>
	)
}
```
