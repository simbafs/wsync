/**
 * init websocket to server with auto reconnecting and ping check
 * @param {string} url
 */
export default function init(url) {
    if (!window) return
    const ws = new WebSocket(url)

    // eventEmitter like, but can run in any js runtime
    const event = {
        map: {},

        on(key, fn) {
            if (this.map[key]) this.map[key].push(fn)
            else this.map[key] = [fn]
        },

        emit(key, data) {
            for (let fn of this.map[key]) {
                fn(data)
            }
        },
    }

    const onOpen = () => console.log(`open websocket connection to ${url}`)
    const onClose = () => {
        // TODO: reconnecting
        console.log(`close websocket connection to ${url}`)
        console.log('trying to reconnect')
        setTimeout(() => init(url), 5000)
    }
    const onError = e => console.error(e)
    const onMessage = data => {
        const obj = JSON.parse(data.data.slice(4))
        event.emit(obj.key, obj.value)
    }

    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('error', onError)
    ws.addEventListener('message', onMessage)

    const wsync = {
        ws,
        event,
    }

    window.wsync = wsync

    return {
        wsync,
        claer: () => {
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

