import { useEffect, useState } from "react";
import init from './init.js'

/** @typedef {import('./init.js').Wsync} Wsync */

/**
 * @param {string} url 
 * @return {Wsync}
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
 * @param {Wsync} wsync 
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
            value: state,
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

// /**
//  * @template S
//  * @template A
//  * @template I
//  *
//  * @param {Wsync} wsync 
//  * @param {string} key 
//  * @param {Reducer<S, A>} reducer 
//  * @param {S | I} initArgs 
//  * @param {(args: S | I) => S} [init]
//  * 
//  * @returns {[S, React.Dispatch<A>]}
//  */
// export function useWsReducer(wsync, key, reducer, initArgs, init) {
//     const [state, updateState] = useReducer((state, action) => {
//         if (action.overwrite) return action.action
//         else return reducer(state, action.action)
//     }, initArgs, init)
//
//     useEffect(() => {
//         fetch(`/get?key=${key}`)
//             .then(res => {
//                 if (res.status === 200) return res.json()
//                 else throw res.text()
//             })
//             .then(data => {
//                 if (!data[key]) return
//                 // setState(data[key])
//                 // TODO: error handle
//                 updateState({ overwrite: true, action: JSON.parse(data[key]) })
//             })
//             .catch(e => console.error(e))
//     }, [])
//
//     useEffect(() => {
//         if (!wsync || wsync.ws.readyState !== 1) return
//
//         // console.log(ws)
//         wsync.ws.send(`updt${JSON.stringify({
//             key,
//             value: JSON.stringify(state),
//         })}`)
//     }, [state, wsync?.ws?.readyState, key])
//
//     wsync?.event.on(key, data => updateState((data)))
//
//     return [state, action => {
//         updateState({ action: action })
//     }]
// }
