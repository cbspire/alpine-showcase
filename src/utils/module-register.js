export const moduleRegister = (alpineComponents = {}, onInit = () => ({})) => {
    window.components = window.components || []
    window.components.push({
        alpineComponents,
        onInit
    })
}
