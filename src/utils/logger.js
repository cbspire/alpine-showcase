export default {
    runtime (data) {
        console.info(`%c${data}`, 'color: lightgreen;')
    },
    module (data) {
        console.info(`%c${data}`, 'color: orange;')
    }
}
