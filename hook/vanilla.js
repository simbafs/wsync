import initWS from './init.js'

/**
 * @callback syncElement
 * @param {HTMLElement} element 
 * @param {any} initState 
 * @param {string} [key='value'] 
 * @return {void}
 */

// from https://github.com/jsdoc/jsdoc/issues/1199#issuecomment-457227207
/** @typedef {{syncElement: syncElement} & import('./init.js').Wsync} EWsync */

/**
 * @param {string} url 
 * @return {EWsync}
 */
export default function init(url) {
    const { clear, wsync } = initWS(url)

    function syncElement(element, initState, key = 'value') {
        const { wsyncKey } = element.dataset
        wsync.event.on(wsyncKey, data => {
            element[key] = data
        })

        element[key] = initState

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

    wsync.syncElement = syncElement

    // syncElement(document.querySelector('#count'))
    return {
        wsync,
        clear,
    }
}

