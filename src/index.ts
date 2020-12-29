import './styles/index.scss'

import * as settings from './utils/store'
import log from './utils/logger'

log('🍊⚓ Initializing DCRefresher.')

let loadStart = performance.now()

import { modules } from './core/modules'
import { filter } from './core/filtering'

if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
  settings.load()
}

import Preview from './modules/preview'
import DarkMode from './modules/darkmode'
import AdBlock from './modules/adblock'
import Fonts from './modules/fonts'
import Ip from './modules/ip'
import AutoRefresh from './modules/refresh'
import Layout from './modules/layout'

if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
  modules
    .load(DarkMode, Fonts, AdBlock, AutoRefresh, Preview, Ip, Layout)
    .then(() => {
      log(
        `🍊👟 DCRefresher Module Loaded. took ${(
          performance.now() - loadStart
        ).toFixed(2)}ms.`
      )

      loadStart = performance.now()

      filter.run(true)
    })
}

const refresherMain = async () => {
  await filter.run(true)

  log(
    `🍊✔️ DCRefresher + Page Loaded. took ${(
      performance.now() - loadStart
    ).toFixed(2)}ms.`
  )
}
window.addEventListener('load', refresherMain)
