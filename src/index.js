import './styles/index.scss'

const settings = require('./utils/store.js')
const http = require('./utils/http.js')
const ip = require('./utils/ip.js')
const log = require('./utils/logger.js')

log('🍊⚓ Initializing DCRefresher.')

const modules = require('./core/modules')
const filter = require('./core/filtering')

modules.register(require('./modules/ads.js'), filter)
modules.register(require('./modules/comment_ads.js'), filter)
modules.register(require('./modules/fonts.js'), filter)
modules.register(require('./modules/refresh.js'), filter)

const refresherMain = async () => {
  await filter.run(true)

  log('🍊✔️ DCRefresher Loaded.')
}

;(async () => {
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', refresherMain)
  }

  await filter.run()
})()
