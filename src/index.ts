import './styles/index.scss'

import * as settings from './utils/store'
import log from './utils/logger'

log('🍊⚓ Initializing DCRefresher.')

let loadStart = performance.now()

import { modules } from './core/modules'
import { filter } from './core/filtering'

settings.load()

import Preview from './modules/preview'
import DarkMode from './modules/darkmode'
import AdBlock from './modules/adblock'
import Fonts from './modules/fonts'
import Ip from './modules/ip'
import AutoRefresh from './modules/refresh'
import BlockCommentAds from './modules/comment_ads'
import Layout from './modules/layout'

modules.load(
  DarkMode,
  Fonts,
  AdBlock,
  BlockCommentAds,
  AutoRefresh,
  Preview,
  Ip,
  Layout
)

const refresherMain = async () => {
  await filter.run(true)

  log(
    `🍊✔️ DCRefresher + Page Loaded. took ${(
      performance.now() - loadStart
    ).toFixed(2)}ms.`
  )
}
;(() => {
  log(
    `🍊👟 DCRefresher Module Loaded. took ${(
      performance.now() - loadStart
    ).toFixed(2)}ms.`
  )
  loadStart = performance.now()

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', refresherMain)
    window.addEventListener('load', async () => {
      await filter.run(true)
    })
  }
})()
