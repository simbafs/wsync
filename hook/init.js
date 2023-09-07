/**
 * @typedef {Object} Wsync
 * @property {WebSocket} ws
 * @property {Object} val
 * @property {Object} event.map
 * @property {(key: string, fn: (data: any) => void) => void} event.on
 * @property {(key: string, data: any) => void} event.emit
 */

/**
 * init websocket to server with auto reconnecting and ping check
 * @param {string} url
 * @returns {{ wsync: Wsync, clear: () => void}}
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
        console.log(data)
        const obj = JSON.parse(data.data.slice(4))
        event.emit(obj.key, obj.value)
    }

    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('error', onError)
    ws.addEventListener('message', onMessage)

    function update(key, value) {
        ws.send(`updt${JSON.stringify({ key, value })}`)
    }

    const wsync = {
        ws,
        event,
        update,
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
