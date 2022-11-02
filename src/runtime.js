import Alpine from 'alpinejs'
import Log from './utils/logger'

/**
 * Modules initialization
 */
 const initModules = () => {
    window.components = window.components || []
    window.components.push = function (obj) {
        window.components[window.components.length] = obj
        loadModule(obj)
    }
    
    Log.runtime('Runtime: Loading Modules already registered')
    
    window.components.forEach(obj => loadModule(obj))
    
    Log.runtime('Runtime: Loaded')
}


/**
 * This function load a Single Alpine Deferred Module
 * 
 * @param {{components: object, init: function}} data 
 * @returns void
 */
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
            element.setAttribute('x-init', element.getAttribute('defer-x-init'))
            element.removeAttribute('defer-x-data')
            element.removeAttribute('defer-x-init')

            Alpine.initTree(element)
        })
    }
}

/**
 * Lifecycle events
 * 
 * https://github.com/alpinejs/alpine/blob/76f0b736ee4e00902cb1b18fb7675c34e8f3c2da/packages/alpinejs/src/lifecycle.js#L30
 */
document.addEventListener('alpine:initialized', () => {
    Log.runtime('Runtime: Huston, we\'re ready')
    initModules()
})

Alpine.start()

Log.runtime('Runtime: Alpine started')
