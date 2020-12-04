import log from '../utils/logger'

import * as store from '../utils/store'
import { eventBus } from './eventbus'
import { filter } from './filtering'
import Frame from './frame'
import * as ip from '../utils/ip'
import * as http from '../utils/http'

let ACCESSIBLE_UTILS = {
  filter,
  Frame,
  eventBus,
  http,
  ip
}

let module_store = {}

let PERMISSION_REVOKE = {
  fetch: fetch
}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)

const blockFeature = () => {
  window.fetch = blockFeatureMsg
}

const enableFeature = () => {
  window.fetch = PERMISSION_REVOKE.fetch
}

const blockFeatureMsg = () => {
  throw new Error(
    'This function is not available in module. Use require property to use it.'
  )
}

const runModule = (mod: RefresherModule) => {
  let plugins = []

  if (mod.require && mod.require.length) {
    let len = mod.require.length
    for (let mi = 0; mi < len; mi++) {
      plugins.push(ACCESSIBLE_UTILS[mod.require[mi]])
    }
  }

  if (mod.func) {
    mod.func(...plugins)
  }
}

const revokeModule = (mod: RefresherModule) => {
  if (mod.revoke) {
    let plugins = []

    if (mod.require && mod.require.length) {
      let len = mod.require.length
      for (let mi = 0; mi < len; mi++) {
        plugins.push(ACCESSIBLE_UTILS[mod.require[mi]])
      }
    }

    mod.revoke(...plugins)
  }

  if (mod.memory) {
    let keys = Object.keys(mod.memory)

    keys.forEach(v => {
      delete mod.memory[v]
    })
  }
}

export const modules = {
  lists: () => {
    return module_store
  },
  load: async (...mods: RefresherModule[]) => {
    for (let i = 0; i < mods.length; i++) {
      await modules.register(mods[i])
    }

    return true
  },
  register: async (mod: RefresherModule) => {
    if (typeof module_store[mod.name] !== 'undefined') {
      throw new Error(`${mod.name} is already registered.`)
    }

    let status = await store.get(`${mod.name}.status`)
    if (
      mod.status !== false &&
      ((typeof status === 'object' && !Object.keys(status).length) ||
        typeof status === 'undefined' ||
        status === null)
    ) {
      store.set(`${mod.name}.status`, JSON.stringify(mod.status))
    }

    let enable = await store.get(`${mod.name}.enable`)
    if (typeof enable === 'undefined' || enable === null) {
      store.set(`${mod.name}.enable`, mod.default_enable)
    }

    mod.enable = await store.get(`${mod.name}.enable`)
    mod.status = await store.get(`${mod.name}.status`)

    if (mod.settings) {
      console.log(mod.settings)

      // TODO : 모듈 object에 settings field가 존재할 경우 탭에 넣는 등의 처리하기
    }

    module_store[mod.name] = mod

    if (runtime) {
      runtime.sendMessage(null, { registerModules: true, data: module_store })
    }

    if (!mod.enable) {
      log(`📁 ignoring ${mod.name}. The module is disabled.`)
      return
    }

    if (mod.url && !mod.url.test(location.href)) {
      log(
        `📁 ignoring ${mod.name}. current URL is not matching with the module\'s URL value.`
      )
      return
    }

    blockFeature()
    runModule(mod)
    enableFeature()

    log(`📁 ${mod.name} module loaded.`)
  }
}

runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (typeof msg === 'object' && msg.updateSettings) {
    module_store[msg.name].enable = msg.value

    if (!msg.value) {
      revokeModule(module_store[msg.name])
      return
    }

    runModule(module_store[msg.name])
  }
})
