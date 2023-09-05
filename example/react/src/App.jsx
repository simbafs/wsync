import useWsync, { useWsState } from '../../vanilla/static/hook/react'

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

export default App
