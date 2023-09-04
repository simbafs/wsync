import initWS from './init.js'

export default function init(url) {
    const { clear, wsync } = initWS(url)

    function syncElement(element, key = 'value') {
        wsync.event.on(element.dataset.wsyncKey, data => {
            element[key] = data
        })

        element.oninput = e => {
            wsync.ws.send(
                `updt${JSON.stringify({
                    key: element.dataset.wsyncKey,
                    value: e.target[key],
                })}`
            )
        }
    }

    wsync.syncElement = syncElement

    // syncElement(document.querySelector('#count'))
    return {
        wsync,
        clear,
    }
}

// for vanilla js
