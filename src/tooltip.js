import Log from './utils/logger'
import { moduleRegister } from './utils/module-register'
import { promiseResolver } from './utils/promise-resolver'

const LibraryLoaded = promiseResolver()

const Tooltip = () => {
    Log.module('Component Tippy init')

    return {
        init () {
            const dataset = this.$el.dataset

            LibraryLoaded.promise.then((Tippy) => {
                Tippy(this.$el, { 
                    content: dataset.tooltip,
                    placement: dataset.placement || 'top',
                    delay: dataset.delay || '100',
                    duration: dataset.duration || '500',
                 })
            })
        }
    }
}

const initTooltipLibrary = () => {
    import(/* webpackChunkName: "vendor/tippy" */ './vendor/tippy')
        .then((module) => {
            const Tippy = module.default
            LibraryLoaded.resolve(Tippy)
        })

    Log.module('Module Tippy initialized')
}

moduleRegister(
    { Tooltip },
    initTooltipLibrary
)
