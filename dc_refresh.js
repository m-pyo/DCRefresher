/**
 * getParameterByname
 * source :
 * @param {String} name 쿼리의 이름 ex:) ?id=XXX : name = id
 * @param {String} url URL, 미지정시 window.location.href 사용
 * @copyright https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
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

// 초기화 변수

let pgId = getParameterByName('id')
let cachedNew = []
let gTableOrigin
let isMinor = /dcinside\.com\/mgallery/g.test(window.location.href)
let isGaeNyum = getParameterByName('exception_mode') == 'recommend'
let isPageSpec = getParameterByName('page') != null
let fetchURL =
  'https://gall.dcinside.com/' +
  (isMinor ? 'mgallery/' : '') +
  'board/lists?id=' +
  pgId +
  (isGaeNyum ? '&exception_mode=recommend' : '') +
  (isPageSpec ? '&page=' + getParameterByName('page') : '')

/**
 * 새 글 알림 캐쉬에 추가하는 함수입니다.
 * @param {HTMLDocument} t 가져올 ID의 Document
 * @param {Boolean} Isinit 초기화 인가? (새로운 class 변경 없음)
 */

let addNewCaching = (t, Isinit) => {
  if (typeof t === 'undefined' || t == null) return
  var idNumbers = t.getElementsByClassName('gall_num')
  var __idn_l = idNumbers.length

  for (var i = 0; i < __idn_l; i++) {
    if (!Isinit && typeof cachedNew[idNumbers[i].innerText] === 'undefined') {
      idNumbers[i].classList.add('__dc_newPost')
    }
    cachedNew[idNumbers[i].innerText] = {}
  }
}

/**
 * div의 가로 세로를 w, h 에 맞춰 정렬하는 함수입니다.
 * @param {HTMLElement} div top, bottom 등을 맞출 element
 * @param {Number} w 마우스 포인터의 x 값
 * @param {Number} h 마우스 포인터 y 값
 */
let recalcLeftRight = (div, w, h) => {
  var bnd_rect = div.getBoundingClientRect()
  if (h + bnd_rect.height > window.innerHeight) {
    div.style.bottom = window.innerHeight - h + 'px'
  } else {
    div.style.top = h + 'px'
  }

  if (w + bnd_rect.width > window.innerWidth) {
    div.style.right = window.innerWidth - w + 'px'
  } else {
    div.style.left = w + 'px'
  }
}

/**
 * 디시인사이드 페이지에 GET 요청을 보내 게시글을 가져옵니다.
 * @param {HTMLElement} div 가져온 값을 적용할 HTMLElement
 * @param {String} id 게시글의 ID값
 */
let fetchPostInfo = async (div, id) => {
  let response = await fetch(
    'https://gall.dcinside.com/mgallery/board/view/?id=' + pgId + '&no=' + id,
    { method: 'GET', mode: 'cors', cache: 'no-store' }
  )

  let domPs = new DOMParser().parseFromString(
    await response.text(),
    'text/html'
  )

  let cntWrap = document.createElement('div')
  cntWrap.className = '__hoverBox_contentWrap'

  let upvote = domPs.getElementById('recommend_view_up_' + id).innerText
  let downvote = domPs.getElementById('recommend_view_down_' + id).innerText
  let fetchedWrittingBox = domPs.getElementsByClassName('writing_view_box')
  fetchedWrittingBox[0].style.float = 'unset'
  fetchedWrittingBox[0].style.maxWidth = 'unset'
  fetchedWrittingBox[0].style.width = '100%'

  cntWrap.appendChild(fetchedWrittingBox[0])
  div.appendChild(cntWrap)

  // 컨텐츠 / 댓글 분리자입니다.
  var lineComment = document.createElement('div')
  lineComment.className = '__hoverBox_seperater'
  cntWrap.appendChild(lineComment)
}

/**
 * 오른쪽 클릭시 오버레이 생성
 * @param {HTMLDocument} t 파싱된 게시판 HTML 소스
 */
let addHoverListener = t => {
  if (typeof t === 'undefined' || t == null) return

  var postBox = t.getElementsByClassName('ub-content')

  for (var z = 0; z < postBox.length; z++) {
    var postId = postBox[z].getElementsByClassName('gall_num')[0].innerHTML

    var createdOverlay = null
    ;(function (e, postId) {
      // 컨텐츠 박스 오른쪽 클릭시
      e.addEventListener('contextmenu', async ev => {
        ev.preventDefault()

        createdOverlay = await createTooltipOverlay(postId)
        createOuterOverlay(createdOverlay)
        fillWithLoader(createdOverlay)
        await fetchPostInfo(createdOverlay, postId)
        recalcLeftRight(createdOverlay, ev.clientX - 5, ev.clientY - 5)

        return ev.preventDefault()
      })
    })(postBox[z], postId)
  }
}

let fillWithLoader = div => {
  div.innerHTML = '<div class="__hoverBox_loader"></div>'
}

/**
 * 툴팁 오버레이 구조를 만들고 body에 append 합니다.
 * @param {String} id 게시글 ID
 */

let createTooltipOverlay = async id => {
  var div = document.createElement('div')
  div.id = '__hoverBox_num_' + id
  div.className = '__hoverBox_wrap'
  div.dataset.id = id
  div.className += ' __hoverBox_loading'

  document.getElementsByTagName('body')[0].appendChild(div)
  return div
}

/**
 * 오버레이를 제거합니다.
 * @param {HTMLElement} e 제거할 element
 */
let destroyTooltipOverlay = e => e.parentNode.removeChild(e)

/**
 * 오버레이 밖을 덮을 반투명한 검은 창을 만듭니다.
 * @param {HTMLElement} inner 오버레이 element
 */
let createOuterOverlay = inner => {
  var outer = document.createElement('div')
  outer.className = '__hoverBox_outer'
  outer.id = '__hoverBox_outerId'

  document.getElementsByTagName('body')[0].append(outer)
  ;(function (inner, outer) {
    outer.addEventListener('click', () => {
      outer.style.opacity = 0
      inner.style.opacity = 0
      setTimeout(() => {
        destroyTooltipOverlay(inner, inner.dataset.postid)
        outer.parentNode.removeChild(outer)
      }, 300)
    })
  })(inner, outer)

  setTimeout(() => {
    outer.style.opacity = 1
  }, 1)
  return outer
}

/**
 * DOMContentLoaded : 페이지 HTML 로드 완료
 */
window.addEventListener('DOMContentLoaded', () => {
  // 폰트 교체 -> Noto Sans CJK KR
  let gElements = document.getElementsByClassName('dcwrap')
  for (let i = 0, l = gElements.length; i < l; i++) {
    gElements[i].style.fontFamily = "'Noto Sans CJK KR', sans-serif"
  }

  if (/board\/lists/g.test(window.location.href)) {
    gTableOrigin = document.getElementsByClassName('gall_list')[0]
  }

  addNewCaching(gTableOrigin, true)
  addHoverListener(gTableOrigin)

  if (/board\/lists\?id=/g.test(window.location.href) && pgId != null) {
    setInterval(() => {
      fetch(fetchURL, { method: 'GET', mode: 'cors', cache: 'no-store' }).then(
        async response => {
          let domPs = new DOMParser().parseFromString(
            await response.text(),
            'text/html'
          )

          let gTable = domPs.getElementsByClassName('gall_list')[0]
          addNewCaching(gTable, false)
          gTableOrigin.innerHTML = ''
          gTableOrigin.append(gTable)
          addHoverListener(gTableOrigin)
        }
      )
    }, 5000)
  }
})
