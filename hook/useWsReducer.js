import { useReducer } from "react";

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
export default function useWsReducer(ws, key, reducer, initArgs, init) {
    const [state, updateState] = useReducer(reducer, initArgs, init)

    return [state, updateState]
}
