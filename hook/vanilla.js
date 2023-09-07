import initWS from './init.js'

/**
 * @callback mount
 * @param {HTMLElement} element 
 * @param {any} initState 
 * @param {string} [key='value'] 
 * @return {void}
 */

// from https://github.com/jsdoc/jsdoc/issues/1199#issuecomment-457227207
/** @typedef {{mount: mount} & import('./init.js').Wsync} EWsync */

/**
 * init websocket connection and mount tags with attr `data-wsync-key` if doAutoMountnt is true, you can disable auto mount with attr `data-wsync-no-auto="0"`, then call wsync.mount manually
 * @param {string} url 
 * @param {boolean} [doAutoMountnt=true] 
 * @return {EWsync}
 */
export default function init(url, doAutoMountnt = true) {
    const { clear, wsync } = initWS(url)

    function mount(element, key = 'value') {
        const { wsyncKey } = element.dataset
        wsync.event.on(wsyncKey, data => {
            console.log(data)
            element[key] = data
        })

        fetch(`/get?key=${wsyncKey}`)
            .then(res => {
                if (res.status === 200) return res.json()
                else throw res.text()
            })
            .then(data => {
                if (!data[wsyncKey]) return
                element[key] = data[wsyncKey]
            })
            .catch(e => console.error(e))

        element.oninput = e => {
            console.log({ value: e.target[key] })
            wsync.ws.send(
                `updt${JSON.stringify({
                    key: wsyncKey,
                    value: e.target[key],
                })}`
            )
        }
    }

    function autoMount() {
        for (let element of document.querySelectorAll('[data-wsync-key]')) {
            const wsyncNoAuto = ['no', 'false', '0'].includes(element.dataset.wsyncNoAuto)
            if (wsyncNoAuto) continue

            mount(element, getKeyFromElement(element))
        }
    }

    wsync.mount = mount
    wsync.autoMount = autoMount

    if (doAutoMountnt) autoMount()

    // syncElement(document.querySelector('#count'))
    return {
        wsync,
        clear,
    }
}

function getKeyFromElement(element) {
    switch (element.nodeName) {
        case 'INPUT':
            switch (element.type) {
                case 'checkbox':
                case 'radio':
                    return 'checked'
                case 'number':
                case 'range':
                    return 'valueAsNumber'
                default:
                    return 'value'
            }
        default:
            return 'textContent'
    }
}
