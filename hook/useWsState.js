import { useState } from "react";

/**
 * @template T
 * @param {WebSocket} ws 
 * @param {string} key 
 * @param {T} [initState]
 * @returns {[T, React.Dispatch<T>]}
 */
export default function useWsState(ws, key, initState) {
    const [state, setState] = useState(initState)

    return [state, setState]
}
