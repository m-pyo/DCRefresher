import './styles/index.scss'

const settings = require('./utils/store.js')
const http = require('./utils/http.js')
const ip = require('./utils/ip.js')
const log = require('./utils/logger.js')
const observe = require('./utils/observe.js')

log('🍊⚓ Initializing DCRefresher.')

const modules = require('./core/modules')
const filter = require('./core/filtering')

modules.register(require('./modules/ads.js'), filter)
modules.register(require('./modules/fonts.js'), filter)

const refresherMain = () => {
  log('🍊✔️ DCRefresher Loaded.')
}


;(async () => {
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', refresherMain)
  }

  await observe.first()

  filter.run()
})()
