let blockAds = true
let modules = {}
let settings = {}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)

;(
  (window.chrome && window.chrome.storage) ||
  (browser && browser.storage) ||
  storage
).sync.get('광고 차단.enable', v => {
  blockAds = v && v['광고 차단.enable']
})

const checkBlockTarget = str =>
  !![
    '://addc.dcinside.com',
    '://ad.about.co.kr',
    '://neon.netinsight.co.kr',
    '://t1.daumcdn.net/kas/static/ba.min.js',
    '://nstatic.dcinside.com/dgn/gallery/js/panda_tv.js',
    '://wcs.naver.net',
    '://cdn.taboola.com',
    '://securepubads.g.doubleclick.net'
  ].filter(v => str.indexOf(v) > -1).length
;(chrome || browser).webRequest.onBeforeRequest.addListener(
  details => {
    return { cancel: blockAds && checkBlockTarget(details.url) }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)

const messageHandler = (port, msg) => {
  if (typeof msg !== 'object') {
    return
  }

  if (msg.module_store) {
    modules = msg.module_store
  }

  if (msg.settings_store) {
    settings = msg.settings_store
  }

  if (typeof msg.toggleAdBlock !== 'undefined') {
    blockAds = msg.toggleAdBlock
  }

  if (msg.requestRefresherModules) {
    port.postMessage({ responseRefresherModules: true, modules })
  }

  if (msg.requestRefresherSettings) {
    port.postMessage({ responseRefresherSettings: true, settings })
  }
}

runtime.onConnect.addListener(p => {
  p.onMessage.addListener(msg => messageHandler(p, msg))
})

runtime.onMessage.addListener(msg => {
  let toSend = msg

  if (typeof msg === 'string') {
    toSend = JSON.parse(msg)
  }

  messageHandler(null, toSend)
})

runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // TODO : After Install
  } else if (details.reason === 'update') {
    // TODO : Update
  }
})
