/**
 * getParameterByname
 * source : https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * @param {*} name The name of query
 * @param {*} url URL
 */
let getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')

  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

let cachedNew = []
/**
 *
 * @param {*} tables 가져올 텍스트
 * @param {*} Isinit 초기화 인가? (새로운 class 변경 없음)
 */
let addNewCaching = (tables, Isinit) => {
  var idNumbers = tables.getElementsByClassName('gall_num')
  var __idn_l = idNumbers.length

  for (var i = 0; i < __idn_l; i++) {
    if (!Isinit && typeof cachedNew[idNumbers[i].innerText] === 'undefined') {
      idNumbers[i].classList.add('__dc_newPost')
    }
    cachedNew[idNumbers[i].innerText] = {}
  }
}
let gTableOrigin = document.getElementsByClassName('gall_list')[0]

let fetchURL =
  'https://gall.dcinside.com/mgallery/board/lists?id=' +
  getParameterByName('id')

// 폰트 교체 -> Noto Sans CJK KR
let gElements = document.getElementsByClassName('dcwrap')
for (let i = 0, l = gElements.length; i < l; i++) {
  gElements[i].style.fontFamily = "'Noto Sans CJK KR', sans-serif"
}

addNewCaching(gTableOrigin, true)

if (
  /mgallery\/board\/lists\?id=/g.test(window.location.href) &&
  getParameterByName('id') != null
) {
  setInterval(() => {
    fetch(fetchURL, { method: 'GET', mode: 'cors', cache: 'no-store' })
      .then(async response => {
        let domPs = new DOMParser().parseFromString(
          await response.text(),
          'text/html'
        )

        let gTable = domPs.getElementsByClassName('gall_list')[0]
        addNewCaching(gTable, false)
        gTableOrigin.innerHTML = ''
        gTableOrigin.append(gTable)
      })
      .catch(e => {
        console.error(e)
      })
  }, 5000)
}
