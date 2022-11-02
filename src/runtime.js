import Alpine from 'alpinejs'
import Log from './utils/logger'

const loadModule = async (data) => {
    if (typeof data !== 'object') {
        return
    }

    const { alpineComponents, onInit } = data

    if (typeof onInit === 'function') {
        await onInit() /* eslint-disable no-undef */
    }

    for (const componentName in alpineComponents) {
        const componentFunction = alpineComponents[componentName]

        /**
         * Register a new Alpine component
         */
        Alpine.data(componentName, componentFunction)
        Log.runtime(`Runtime: Register Alpine component '${componentName}'`)

        /**
         * Search for all the deferred components
         */
        const components = document.querySelectorAll(`[defer-x-data=${componentName}]`)

        /**
         * Manually load all the components
         */
        components.forEach(element => {
            element.setAttribute('x-data', `${componentName}`)
            element.removeAttribute('defer-x-data')

            Alpine.initTree(element)
        })
    }
}

window.Alpine = Alpine

/**
 * This is the trick
 * Starting Alpine prevent the possibility to manually add or load deferred components
 *
 * What we can do, is to manually load all the x-data Alpine components
 */
// Alpine.start()

document.querySelectorAll('[x-data]').forEach(element => {
    Alpine.initTree(element)
})

Log.runtime('Runtime: Alpine started')

/**
 * Now we use the loader
 */

window.components = window.components || []
window.components.push = function (obj) {
    window.components[window.components.length] = obj
    loadModule(obj)
}

Log.runtime('Runtime: Loading Modules already registered')

window.components.forEach(obj => loadModule(obj))

Log.runtime('Runtime: Loaded')
