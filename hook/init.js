/**
 * init websocket to server with auto reconnecting and ping check
 * @param {string} url
 */
export default function init(url) {
    if (!window) return
    const ws = new WebSocket(url)

    const onOpen = () => console.log(`open websocket connection to ${url}`)
    const onClose = () => {
        // TODO: reconnecting
        console.log(`close websocket connection to ${url}`)
        console.log('trying to reconnect')
        setTimeout(() => init(url), 5000)
    }
    const onError = e => console.error(e)

    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('error', onError)

    window.wsync = {}
    window.wsync.ws = ws

    return {
        ws,
        claer() {
            ws.removeEventListener('open', onOpen)
            ws.removeEventListener('close', onClose)
            ws.removeEventListener('error', onError)
            ws.removeEventListener('message', onMessage)
        },
    }
}

// /**
//  * before setState, sync to websocket
//  * @template T
//  * @param {T} state
//  * @param {(state: T) => void} setState
//  *
//  * @returns {[T, (state: T) => void]}
//  *
//  */
// function sync(state, setState) {
//     // TODO
//
//     return [state, setState]
// }

