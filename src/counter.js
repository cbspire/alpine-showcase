import { moduleRegister } from './utils/module-register'
import Log from './utils/logger'

const Counter = () => {
    return {
        count: 0,
        increment () {
            this.count++
        },
        reset () {
            this.count = 0
        }
    }
}

moduleRegister(
    { Counter },
    () => Log.module('Module Counter initialized')
)
