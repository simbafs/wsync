import useWsState from '../../../hook/useWsState'
import init from '../../../hook/init'
import { useEffect, useState } from 'react'

function App() {
  const [wsync, setWsync] = useState(null)
  const [count, setCount] = useWsState(wsync, 'count', 0)

  useEffect(() => {
    const { wsync, clear } = init('ws://localhost:3000/ws')
    console.log({ wsync })
    setWsync(wsync)
    return clear
  }, [])

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(c => + c + 1 + '')}>Add</button>
    </>
  )
}

export default App
