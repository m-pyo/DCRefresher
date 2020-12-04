let blockAds = true
let modules = {}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)

;((window.chrome && window.chrome.storage) || storage).sync.get(
  '광고 차단.enable',
  v => {
    blockAds = v && v['광고 차단.enable']
  }
)

const checkBlockTarget = str =>
  !![
    '://addc.dcinside.com',
    '://ad.about.co.kr',
    '://neon.netinsight.co.kr',
    '://t1.daumcdn.net/kas/static/ba.min.js',
    '://wcs.naver.net',
    '://cdn.taboola.com',
    '://securepubads.g.doubleclick.net'
  ].filter(v => str.indexOf(v) > -1).length

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    return { cancel: blockAds && checkBlockTarget(details.url) }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)

runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (typeof msg !== 'object') {
    return
  }

  if (msg.registerModules) {
    modules = msg.data
  }

  if (msg.toggleAdBlock) {
    blockAds = msg.data
  }

  if (msg.requestRefresherModules) {
    sendResponse(modules)
  }
})

runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // TODO : After Install
  } else if (details.reason === 'update') {
    // TODO : Update
  }
})
