export const urls = {
  base: 'https://gall.dcinside.com/',
  gall: {
    major: 'https://gall.dcinside.com/',
    mini: 'https://gall.dcinside.com/mini/',
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

export const types = {
  MAJOR: '',
  MINOR: 'mgallery',
  MINI: 'mini'
}

export const commentGallTypes = {
  '': 'G',
  minor: 'M',
  mini: 'MI'
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

  let type = galleryType(url)

  if (type === types.MINI) {
    type = urls.gall.mini
  } else if (type === types.MINOR) {
    type = urls.gall.minor
  } else {
    type = urls.gall.major
  }

  return type + 'board/lists' + queryDraw(['id', 'exception_mode', 'page'], url)
}

export const make = (url: string, options: object) =>
  new Promise((resolve, reject) =>
    fetch(url, options)
      .then(async response => {
        if (response.status && response.status > 400) {
          reject(`${response.status} ${response.statusText}`)
        }

        let body = await response.text()

        if (body.substring(0, 1) === '{') {
          body = JSON.parse(body)
        }

        resolve(body)
      })
      .catch(e => {
        reject(e)
      })
  )

export const checkMinor = (url: string) =>
  /\.com\/mgallery/g.test(url || location.href)

export const checkMini = (url: string) =>
  /\.com\/mini/g.test(url || location.href)

/**
 * URL에서 갤러리 종류를 확인하여 반환합니다.
 *
 * @param url 갤러리 종류를 확인할 URL.
 * @param extra 마이너 갤러리와 미니 갤러리에 붙일 URL suffix.
 */
export const galleryType = (url: string, extra?: string) => {
  if (checkMinor(url)) {
    return types.MINOR + (extra && extra.length ? extra : '')
  } else if (checkMini(url)) {
    return types.MINI + (extra && extra.length ? extra : '')
  }

  return types.MAJOR
}
