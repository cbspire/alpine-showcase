export const parseOptions = (el) => {
    try {
        return JSON.parse(el?.textContent?.trim())
    } catch (error) {
        return {}
    }
}
