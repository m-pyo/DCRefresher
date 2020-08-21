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
    return { cancel: checkBlockTarget(details.url) }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)
