import initWS from './init.js'

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

export default function init(url) {
    const clear = initWS(url)

    const ws = window.wsync.ws

    const onMessage = data => {
        const obj = JSON.parse(data.data.slice(4))
        event.emit(obj.key, obj.value)
    }
    ws.addEventListener('message', onMessage)

    function syncElement(element, key = 'value') {
        event.on(element.dataset.wsyncKey, data => {
            element[key] = data
        })

        element.onchange = e => {
            ws.send(
                `updt${JSON.stringify({
                    key: element.dataset.wsyncKey,
                    value: e.target[key],
                })}`
            )
        }
    }

    window.wsync.syncElement = syncElement

    // syncElement(document.querySelector('#count'))
    return {
        ws,
        syncElement,
        clear() {
            clear()
            ws.addEventListener('message', onMessage)
        },
    }
}

// for vanilla js
