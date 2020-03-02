const log = require('../utils/logger')
const store = require('../utils/store')

let ACCESSIBLE_UTILS = {
  filter: require('./filtering'),
  eventBus: require('./eventbus'),
  http: require('../utils/http'),
  ip: require('../utils/ip')
}

;(() => {
  let module_store = {}

  const modules = {
    lists: module_store,
    register: mod => {
      if (typeof module_store[mod.name] !== 'undefined') {
        throw new Error(`${mod.name} is already registered.`)
      }

      if (
        typeof store.get(`${mod.name}.status`) === 'undefined' ||
        store.get(`${mod.name}.status`) === null
      ) {
        store.set(`${mod.name}.status`, JSON.stringify(mod.status))
      }

      if (
        typeof store.get(`${mod.name}.enable`) === 'undefined' ||
        store.get(`${mod.name}.enable`) === null
      ) {
        store.set(`${mod.name}.enable`, mod.default_enable)
      }

      mod.status = JSON.parse(store.get(`${mod.name}.status`))
      module_store[mod.name] = mod

      if (mod.url && !mod.url.test(location.href)) {
        log(
          `📁 ignoring ${mod.name}. current URL is not matching with the module\'s URL value.`
        )
        return
      }

      let plugins = []

      if (mod.require && mod.require.length) {
        let len = mod.require.length
        for (let mi = 0; mi < len; mi++) {
          plugins.push(ACCESSIBLE_UTILS[mod.require[mi]])
        }
      }

      mod.func(...plugins)

      log(`📁 ${mod.name} module loaded.`)
    }
  }

  module.exports = modules
})()
