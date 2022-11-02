export const promiseResolver = () => {
    let resolveCallback = () => ({})
    let rejectCallback = () => ({})

    const promise = new Promise((resolve, reject) => {
        resolveCallback = resolve
        rejectCallback = reject
    })

    return {
        promise,
        resolve: resolveCallback,
        reject: rejectCallback
    }
}
