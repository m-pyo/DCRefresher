import './styles/index.scss'

const settings = require('./utils/store.js')
const http = require('./utils/http.js')
const ip = require('./utils/ip.js')
const log = require('./utils/logger.js')

log('🍊⚓ Initializing DCRefresher.')

const modules = require('./core/modules')
const filter = require('./core/filtering')
const frame = require('./core/frame')

settings.load()

modules.register(require('./modules/darkmode.js'))
modules.register(require('./modules/fonts.js'))
modules.register(require('./modules/adblock.js'))
modules.register(require('./modules/comment_ads.js'))
modules.register(require('./modules/refresh.js'))
modules.register(require('./modules/preview.js'))
modules.register(require('./modules/ip.js'))

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
