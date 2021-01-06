import * as store from '../utils/store'
import { eventBus } from './eventbus'
import { browser } from 'webextension-polyfill-ts'

let settings_store: { [index: string]: any } = {}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)

export const set = async (module: string, key: string, value: any) => {
  eventBus.emit('RefresherUpdateSetting', module, key, value)

  settings_store[module][key].value = value

  let s = await store.set(`${module}.${key}`, value)

  if (runtime) {
    runtime.sendMessage(
      JSON.stringify({
        settings_store
      })
    )
  }

  return s
}

export const setStore = async (module: string, key: string, value: any) => {
  eventBus.emit('RefresherUpdateSetting', module, key, value)
  settings_store[module][key].value = value
}

export const get = async (module: string, key: string) => {
  return store.get(`${module}.${key}`)
}

export const dump = () => {
  return settings_store
}

export const loadDefault = async (
  module: string,
  key: string,
  settings: RefresherSettings
) => {
  if (!settings_store[module]) {
    settings_store[module] = {}
  }

  let got = await get(module, key)

  if (typeof got === 'undefined' || typeof got === null) {
    settings.value = settings.default
    got = settings.default
  } else {
    settings.value = got
  }

  settings_store[module][key] = settings

  return got
}
