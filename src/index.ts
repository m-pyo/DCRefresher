declare var require: any

import './styles/index.scss'

import log from './utils/logger'

log('🍊⚓ Initializing DCRefresher.')

let loadStart = performance.now()

import './core/block'
import { modules } from './core/modules'
import { filter } from './core/filtering'

let context = require.context('./modules/', true, /\.ts$/)
Promise.all(context.keys().map((v: string) => context(v).default))
  .then((v: any) => modules.load(...v))
  .then(async () => {
    log(
      `🍊✔️ DCRefresher Module Loaded. took ${(
        performance.now() - loadStart
      ).toFixed(2)}ms.`
    )

    await filter.run(false)
  })

window.addEventListener('load', async () => {
  await filter.run(true)
})
