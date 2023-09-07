import initWS from './init.js'

/**
  * like useState in react, but you need to pass `onUpdate` in to render
  * @callback useState
  * @param {string} key 
  * @param {T} value 
  * @param {(state: T) => void} onUpdate 
  * @returns {[T, (val: T | (state: T) => T ) => void ]}
  */

/**
  * mount an HTML element
  * @callback mount
  * @param {HTMLElement} element 
  * @param {string} [key='value'] 
  * @returns {void}
  *
  */

/**
  * autoMount will mount all elements with data-wsync-key and data-wsync-no-auto set to no, false or 0
  * @callback autoMount
  * @returns {void}
  */

// from https://github.com/jsdoc/jsdoc/issues/1199#issuecomment-457227207
/** @typedef {{
 *      useState: useState,
 *      mount: mount, 
 *      autoMount: autoMount,
 *  } & import('./init.js').Wsync} EWsync 
 *  */

/**
 * init websocket connection and mount tags with attr `data-wsync-key` if doAutoMountnt is true, you can disable auto mount with attr `data-wsync-no-auto="0"`, then call wsync.mount manually
 * @param {string} url 
 * @param {boolean} [doAutoMountnt=true] 
 * @return {EWsync}
 */
export default function init(url, doAutoMountnt = true) {
    const { clear, wsync } = initWS(url)

    /** @type useState */
    function useState(key, value, onUpdate) {
        wsync.event.on(key, onUpdate)

        // get server side state at beginning
        fetch(`/get?key=${key}`)
            .then(res => {
                if (res.status == 200) return res.json()
                else throw res.text()
            })
            .then(data => {
                if (!data[key]) return
                onUpdate(data[key])
            })
            .catch(console.error)

        return [value, (val) => {
            if (val instanceof Function) val = val(value)
            wsync.update(key, val)
        }]
    }

    /** @type mount */
    function mount(element, key = 'value') {
        const { wsyncKey } = element.dataset

        const [_, setState] = useState(wsyncKey, element[key], data => element[key] = data)
        element.oninput = e => setState(e.target[key])
    }

    /** @type autoMount */
    function autoMount() {
        for (let element of document.querySelectorAll('[data-wsync-key]')) {
            const wsyncNoAuto = ['no', 'false', '0'].includes(element.dataset.wsyncNoAuto)
            if (wsyncNoAuto) continue

            mount(element, getKeyFromElement(element))
        }
    }

    wsync.useState = useState
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
