import './styles/index.scss'

const settings = require('./utils/store.js')
const http = require('./utils/http.js')
import log from './utils/logger'

log('🍊⚓ Initializing DCRefresher.')

import modules from './core/modules'
import { filter } from './core/filtering'
const frame = require('./core/frame')

settings.load()

import { Preview } from './modules/preview'
import { DarkMode } from './modules/darkmode'
import { AdBlock } from './modules/adblock'
import { Fonts } from './modules/fonts'
import { Ip } from './modules/ip'
import { AutoRefresh } from './modules/refresh'

modules.register(DarkMode)
modules.register(Fonts)
modules.register(AdBlock)
modules.register(require('./modules/comment_ads'))
modules.register(AutoRefresh)
modules.register(Preview)
modules.register(Ip)

const refresherMain = async () => {
  await filter.run(true)

  log('🍊✔️ DCRefresher Loaded.')
}
;(async () => {
  filter.run()

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', refresherMain)
    window.addEventListener('load', async () => {
      await filter.run(true)
    })
  }
})()
