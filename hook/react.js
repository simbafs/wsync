import { useEffect, useState, useReducer } from "react";
import init from './init.js'

/**
 * @param {string} url 
 */
export default function useWsync(url) {
    const [wsync, setWsync] = useState(null)

    useEffect(() => {
        const { wsync, clear } = init(url)
        setWsync(wsync)
        return clear
    }, [url])

    return wsync
}

/**
 * @template T
 * @param {object} wsync 
 * @param {WebSocket} wsync.ws
 * @param {string} key 
 * @param {T} [initState]
 * @returns {[T, React.Dispatch<T>]}
 */
export function useWsState(wsync, key, initState) {
    const [state, setState] = useState(initState)

    useEffect(() => {
        fetch(`/get?key=${key}`)
            .then(res => {
                if (res.status === 200) return res.json()
                else throw res.text()
            })
            .then(data => {
                if (!data[key]) return
                setState(data[key])
            })
            .catch(e => console.error(e))
    }, [])

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

/**
 * @template S
 * @template A
 * 
 * @callback Reducer
 * @param {S} state
 * @param {A} action
 * @returns {S}
 */

/**
 * @template S
 * @template A
 * @template I
 *
 * @param {WebSocket} ws 
 * @param {string} key 
 * @param {Reducer<S, A>} reducer 
 * @param {S | I} initArgs 
 * @param {(args: S | I) => S} [init]
 * 
 * @returns {[S, React.Dispatch<A>]}
 */
export function useWsReducer(ws, key, reducer, initArgs, init) {
    const [state, updateState] = useReducer(reducer, initArgs, init)

    return [state, updateState]
}
