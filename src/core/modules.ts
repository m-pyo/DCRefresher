import log from '../utils/logger'

import * as store from '../utils/store'
import { eventBus } from './eventbus'
import { filter } from './filtering'
import Frame from './frame'
import * as ip from '../utils/ip'
import * as http from '../utils/http'

import { browser } from 'webextension-polyfill-ts'

import * as settings from './settings'

let UTILS: { [index: string]: object } = {
  filter,
  Frame,
  eventBus,
  http,
  ip
}

let module_store: { [index: string]: any } = {}

const runtime = browser && browser.runtime

const runModule = (mod: RefresherModule) => {
  let plugins = []

  if (mod.require && mod.require.length) {
    let len = mod.require.length
    for (let mi = 0; mi < len; mi++) {
      plugins.push(UTILS[mod.require[mi]])
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
        plugins.push(UTILS[mod.require[mi]])
      }
    }

    mod.revoke(...plugins)
  }

  if (mod.memory) {
    for (const key in mod.memory) {
      mod.memory[key] = undefined
    }
  }
}

export const modules = {
  lists: () => {
    return module_store
  },
  load: (...mods: RefresherModule[]) =>
    new Promise<void>(async (resolve, reject) => {
      for (let i = 0; i < mods.length; i++) {
        await modules.register(mods[i])
      }

      resolve()
    }),

  register: async (mod: RefresherModule) => {
    let start = performance.now()

    if (typeof module_store[mod.name] !== 'undefined') {
      throw new Error(`${mod.name} is already registered.`)
    }

    let enable = await store.get(`${mod.name}.enable`)
    mod.enable = enable

    if (typeof enable === 'undefined' || enable === null) {
      store.set(`${mod.name}.enable`, mod.default_enable)
      mod.enable = mod.default_enable
    }

    if (mod.settings) {
      for (const key in mod.settings) {
        mod.status[key] = await settings.loadDefault(
          mod.name,
          key,
          mod.settings[key]
        )
      }
    }

    module_store[mod.name] = mod

    let stringify = JSON.stringify({
      module_store,
      settings_store: settings.dump()
    })

    runtime.sendMessage(stringify)

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

    runModule(mod)

    log(
      `📁 ${mod.name} module loaded. took ${(performance.now() - start).toFixed(
        2
      )}ms.`
    )
  }
}

if (runtime.onMessage) {
  runtime.onMessage.addListener((msg: { [index: string]: any }) => {
    if (typeof msg === 'object' && msg.updateModuleSettings) {
      module_store[msg.name].enable = msg.value
      store.set(`${msg.name}.enable`, msg.value)

      runtime.sendMessage(
        JSON.stringify({
          module_store
        })
      )

      if (!msg.value) {
        revokeModule(module_store[msg.name])
        return
      }

      runModule(module_store[msg.name])
    } else if (typeof msg === 'object' && msg.updateUserSetting) {
      settings.set(msg.name, msg.key, msg.value)
    }
  })
}

eventBus.on(
  'RefresherUpdateSetting',
  (module: string, key: string, value: any) => {
    if (module_store[module]) {
      module_store[module].status[key] = value
    }
  }
)
