# Alternative Alpine.js usages

Working in a WordPress environment, the amount of javascript in a "simple" page it can be really huge.
If you're tired about fighting with webpack chunks, generating runtime file,
this repo shows you the best approach that I found to use Alpine.js in large projects.


# Main Idea: Module "concept"

This idea comes from the Google Tag Manager approach.
You can write into your code inside a simple javascript array, and when the "main" file is loaded he redefine the `push` function inside this array.

In this way we can load `Modules`  dynamically

> I defined `Module`, a list of Alpine.js Components that can be used in a single application (with limited scope)

```JS
window.components = window.components || []
window.components.push = function (obj) {
  window.components[window.components.length] = obj
  loadModule(obj)
}
window.components.forEach(obj => loadModule(obj))
```

# Module structure

Each single module has a predefined structure, 
```JS
{
  components: {},
  init: () => ({}) /* Callback after initialization */
}
```

### `components` object are a List of Alpine components

For each component, we declare a new `Alpine.data` component and we load the current deferred components, replacing `defer-x-data` with `x-data`

> With Alpine.js v3 we have to replace also the `x-init` because is an Auto-evaluate method

> See https://alpinejs.dev/directives/init#auto-evaluate-init-method

Code sample
```JS
for (const componentName in components) {
  const componentFunction = components[componentName]
  Alpine.data(componentName, componentFunction)
  const components = document.querySelectorAll(`[defer-x-data=${componentName}]`)
  components.forEach(element => {
    element.setAttribute('x-data', `${componentName}`)
    element.removeAttribute('defer-x-data')
    Alpine.initTree(element)
  })
}
```

And the follow example usage

```HTML
<div x-ignore class="counter">
  <div defer-x-data="Counter">
    <button class="counter-button btn" @click.prevent="increment()">
      <span x-text="count"></span>
    </button>
  </div>
</div>
```


# Data options as a JSON

Pass parameters to an Alpine.js object can be really easy if we can use this simple script

```JS
export const parseOptions = (el) => {
  try {
    return JSON.parse(el?.textContent?.trim())
  } catch (error) {
    return {}
  }
}
```

Just to declare into your `x-data` scope, a script
```HTML
<script x-ref="json" type="application/json">
  @json($data) 
</script>
```

And use it into your component

```JS
const Counter = () => {
  return {
    init() {
      const options = parseOptions(this.$refs.json)
    },
    ....
  }
}
```

HTML still clear, component options are easy described and complex as you prefer



# Dynamic loading Libraries

Using libraries only when needed impact (in a better way) also the Page speed of your website.
Instead of loading a Swiper or a Lightbox instance before loading your component, you can use two methods:


## Interactive loading

At this way, the first click on the Gallery downloads all the necessary libraries then open the Gallery.
At the next interaction, the library is already loaded and you don't need to download it again (webpack do it for you)

```JS
const Gallery = () => {
  return {
    open () {
      this.images = parseOptions(this.$refs.json)
      const elements = this.images.map(image => ({ href: image }))
      import(/* webpackChunkName: "vendor/glightbox" */ './vendor/glightbox')
        .then((module) => {
          const GLightbox = module.default
          const gallery = GLightbox({ elements })
          gallery.open()
        })
    }
  }
}
```


## Intersection Observer

During the module `init` callback, you can start the `IntersectionObserver` and watch when is needed to load the library (or whatever you wish) and dispatch events

** DEMO is WIP **



# Work In progress

[ ] How to detect deferred components after Module loaded
[ ] Demo Intersection observer