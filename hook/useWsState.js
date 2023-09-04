import { useEffect, useState } from "react";

/**
 * @template T
 * @param {object} wsync 
 * @param {WebSocket} wsync.ws
 * @param {string} key 
 * @param {T} [initState]
 * @returns {[T, React.Dispatch<T>]}
 */
export default function useWsState(wsync, key, initState) {
    const [state, setState] = useState(initState)
    useEffect(() => {
        if (!wsync || wsync.ws.readyState !== 1) return

        // console.log(ws)
        wsync.ws.send(`updt${JSON.stringify({
            key,
            value: String(state),
        })}`)
    }, [state, wsync?.ws?.readyState, key])

    wsync?.event.on(key, data => setState(data))

    return [state, v => setState(v)]
}
