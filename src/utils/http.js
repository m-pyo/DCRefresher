const urls = {
  base: 'https://gall.dcinside.com/',
  gall: {
    major: 'https://gall.dcinside.com/gallery/',
    minor: 'https://gall.dcinside.com/mgallery/'
  },
  manage: {
    delete:
      'https://gall.dcinside.com/ajax/minor_manager_board_ajax/delete_list'
  },
  comments: 'https://gall.dcinside.com/board/comment/',
  dccon: {
    detail: 'https://gall.dcinside.com/dccon/package_detail',
    info: 'https://dccon.dcinside.com/index/get_info',
    buy: 'https://dccon.dcinside.com/index/buy'
  }
}

const heads = {
  'X-Requested-With': 'XMLHttpRequest'
}

// from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const query = (str, query) => {
  var match = RegExp('[?&]' + query + '=([^&]*)').exec(str)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

const viewRegex = /\/board\/view\//g
const mgall = /dcinside\.com\/mgallery/g
const exception = /exception_mode\=/g

const queryDraw = (lis, url) => {
  let str = ''
  let len = lis.length
  for (var i = 0; i < len; i++) {
    if (url.indexOf(lis[i] + '=') < 0) continue
    str += (i ? '&' : '?') + lis[i] + '=' + query(url, lis[i])
  }

  return str
}

const view = url => {
  if (!viewRegex.test(url)) return url

  url =
    (mgall.test(url) ? urls.gall.minor : urls.gall.major) +
    'board/lists' +
    queryDraw(['id', 'exception_mode', 'page'], url)

  return url
}

const make = (url, options) =>
  new Promise((resolve, reject) =>
    fetch(url, options).then(async response => {
      if (response.status && response.status > 400) {
        reject(response.statusText)
      }

      let body = await response.text()

      if (body.substring(0, 1) === '{') {
        body = JSON.parse(body)
      }

      resolve(body)
    })
  )

module.exports = {
  make,
  urls,
  view,
  heads
}
