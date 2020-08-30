export const urls = {
  base: 'https://gall.dcinside.com/',
  gall: {
    major: 'https://gall.dcinside.com/',
    minor: 'https://gall.dcinside.com/mgallery/'
  },
  view: 'board/view/?id=',
  vote: 'https://gall.dcinside.com/board/recommend/vote',
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

export const heads = {
  'X-Requested-With': 'XMLHttpRequest'
}

// from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export const query = (str: string, query: string) => {
  var match = RegExp('[?&]' + query + '=([^&]*)').exec(str)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

export const viewRegex = /\/board\/view\//g
export const mgall = /dcinside\.com\/mgallery/g

const queryDraw = (lis: string[], url: string) => {
  let str = ''
  let len = lis.length
  for (var i = 0; i < len; i++) {
    if (url.indexOf(lis[i] + '=') < 0) continue
    str += (i ? '&' : '?') + lis[i] + '=' + query(url, lis[i])
  }

  return str
}

export const view = (url: string) => {
  if (!viewRegex.test(url)) return url

  url =
    (mgall.test(url) ? urls.gall.minor : urls.gall.major) +
    'board/lists' +
    queryDraw(['id', 'exception_mode', 'page'], url)

  return url
}

export const make = (url: string, options: object) =>
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

export const checkMinor = (url: string) =>
  /\.com\/mgallery/g.test(url || location.href)
