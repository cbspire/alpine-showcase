import { moduleRegister } from './utils/module-register'
import Log from './utils/logger'
import { parseOptions } from './utils/data-parser'

const Gallery = () => {
    return {
        open () {
            this.images = parseOptions(this.$refs.json)
            const elements = this.images.map(image => ({ href: image, width: 500, height: 500 }))

            import(/* webpackChunkName: "vendor/glightbox" */ './vendor/glightbox')
                .then((module) => {
                    const GLightbox = module.default
                    const gallery = GLightbox({ elements })
                    gallery.open()
                })
        }
    }
}

moduleRegister(
    { Gallery },
    () => Log.module('Module Gallery initialized')
)
