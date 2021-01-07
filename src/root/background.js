let blockAds = true
let modules = {}
let settings = {}
let blocks = {}
let blockModes = {}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)

const str =
  (window.chrome && window.chrome.storage) || (browser && browser.storage)

const set = (key, value) => {
  if (!str) {
    throw new Error("This browser doesn't support storage API.")
  }

  let obj = {}
  obj[key] = value

  return (str.sync || str.local).set(obj)
}

const get = key => {
  if (!str) {
    throw new Error("This browser doesn't support storage API.")
  }

  return new Promise()((resolve, reject) =>
    (str.sync || str.local).get(key, v => {
      resolve(v[key])
    })
  )
}

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
    '://t1.daumcdn.net/kas/static/',
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

const messageHandler = async (port, msg) => {
  if (typeof msg !== 'object') {
    return
  }

  if (msg.updateUserSetting) {
    await set(`${msg.name}.${msg.key}`, msg.value)
  }

  if (msg.updateBlocks) {
    Object.keys(msg.blocks_store).forEach(async (key, i) => {
      await set(`__REFRESHER_BLOCK:${key}`, msg.blocks_store[key])
    })
    blocks = msg.blocks_store

    Object.keys(msg.blockModes_store).forEach(async (key, i) => {
      await set(`__REFRESHER_BLOCK:${key}:$MODE`, msg.blockModes_store[key])
    })
    blockModes = msg.blockModes_store
  }

  if (msg.module_store) {
    modules = msg.module_store
  }

  if (msg.settings_store) {
    settings = msg.settings_store
  }

  if (msg.blocks_store) {
    blocks = msg.blocks_store
  }

  if (msg.blockModes_store && Object.keys(msg.blockModes_store).length) {
    blockModes = msg.blockModes_store
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

  if (msg.requestRefresherBlocks) {
    port.postMessage({ responseRefresherBlocks: true, blocks, blockModes })
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

chrome.contextMenus.create({
  title: '차단',
  contexts: ['all'],
  documentUrlPatterns: ['*://gall.dcinside.com/*'],
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      blockSelected: true
    })
  }
})
