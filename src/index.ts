import './styles/index.scss'

import log from './utils/logger'

log('🍊⚓ Initializing DCRefresher.')

let loadStart = performance.now()

import './core/block'
import { modules } from './core/modules'
import { filter } from './core/filtering'

import Preview from './modules/preview'
import DarkMode from './modules/darkmode'
import ContentBlock from './modules/block'
import AdBlock from './modules/adblock'
import Fonts from './modules/fonts'
import UserInfo from './modules/userinfo'
import AutoRefresh from './modules/refresh'
import Layout from './modules/layout'

modules
  .load(
    DarkMode,
    Fonts,
    AdBlock,
    ContentBlock,
    AutoRefresh,
    Preview,
    UserInfo,
    Layout
  )
  .then(() => {
    log(
      `🍊✔️ DCRefresher Module Loaded. took ${(
        performance.now() - loadStart
      ).toFixed(2)}ms.`
    )

    loadStart = performance.now()

    filter.run(true)
  })

window.addEventListener('load', async () => {
  await filter.run(true)
})
