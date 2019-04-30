/**
 * URL의 QueryString에서 name의 값을 가져옵니다.
 *
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

/**
 * 쿠키를 가져옵니다.
 * @param {String} name 쿠키 key 이름
 */
let getCookie = name => {
  var value = '; ' + document.cookie
  var parts = value.split('; ' + name + '=')
  if (parts.length == 2) {
    return parts
      .pop()
      .split(';')
      .shift()
  }
}

// 초기화 변수
let pgId = getParameterByName('id')
let cachedNew = []
let gTableOrigin
let isMinor = /dcinside\.com\/mgallery/g.test(window.location.href)
let isGaeNyum = getParameterByName('exception_mode') == 'recommend'
let pgNum = getParameterByName('page') || 1
let isPageSpec = pgNum != null
let fetchURL =
  'https://gall.dcinside.com/' +
  (isMinor ? 'mgallery/' : '') +
  'board/lists?id=' +
  pgId +
  (isGaeNyum ? '&exception_mode=recommend' : '') +
  (isPageSpec ? '&page=' + pgNum : '')

/**
 * 새 글 알림 캐쉬에 추가하는 함수입니다.
 * @param {DocumentFragment} t 가져올 ID의 Document
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
 * 아이콘 URL을 파싱해 닉네임 종류를 알아냅니다.
 * @param {String} iconUrl 아이콘의 URL
 */
let iconParse = iconUrl => {
  if (/\/fix_nik\.gif/.test(iconUrl)) return 1
  if (/\/nik\.gif/.test(iconUrl)) return 2
  if (/\/fix_sub_managernik\.gif/.test(iconUrl)) return 3
  if (/\/fix_managernik\.gif/.test(iconUrl)) return 4

  return 0
}

/**
 * HTML 데이터에서 유용한 데이터를 파싱하여 결과를 Object로 반환합니다.
 * @param {DocumentFragment} d 값 데이터 Document
 * @param {String} id 게시글 ID
 * @returns {Object} 도큐멘트에서 파싱한 값
 */
let getInfofromDocument = (d, id) => {
  let upvotes = d.getElementById('recommend_view_up_' + id).innerText
  let downvotes = d.getElementById('recommend_view_down_' + id).innerText
  let commentCounts = d.getElementById('comment_total_' + id).innerText
  let category = d.getElementsByClassName('title_headtext')[0].innerText
  let title = d.getElementsByClassName('title_subject')[0].innerText
  let __nick_obj = d.getElementsByClassName('gall_writer')[0]
  let nick = __nick_obj.dataset.nick
  let unique_id = __nick_obj.dataset.uid
  let ip_addr = __nick_obj.dataset.ip
  let date = d.getElementsByClassName('gall_date')[0].title

  let __voteCodeParentElem = d.getElementsByClassName('recommend_kapcode')[0]
  let voteCodeImage =
    typeof __voteCodeParentElem !== 'undefined'
      ? 'https://gall.dcinside.com/kcaptcha/image/?kcaptcha_type=recommend&time=' +
        new Date().getTime()
      : null

  // let voteCodeImage = __voteCodeParentElem.getElementsByTagName('img')[0].src

  let viewContent = d.getElementsByClassName('gallview_head')[0]
  let __nickCon = viewContent.getElementsByTagName('img')[0]
  let __nickTypeURL = typeof __nickCon !== 'undefined' ? __nickCon.src : ''
  let nickType = iconParse(__nickTypeURL)

  return {
    upvotes,
    downvotes,
    commentCounts,
    title,
    category,
    nick,
    unique_id,
    ip_addr,
    date,
    nickType,
    voteCodeImage
  }
}

/**
 * 닉네임 Dom을 렌더링합니다.
 * @param {Object} postData 데이터 구조
 */
let renderNicks = postData => {
  return `<div class="__hoverBox_nickWrap">
  <span class="__hoverBox_nickIcon __hoverBox_icon${postData.nickType}"></span>
  <span class="__hoverBox_nickName">${postData.nick}</span>
  <span class="__hoverBox_nickId" title="해당 유저의 갤로그를 엽니다." onclick="window.open('https://gallog.dcinside.com/${
  postData.unique_id
}')">${postData.unique_id}</span>
  <span class="__hoverBox_nickIP">${postData.ip_addr}</span>
  <span class="__hoverBox_date">${postData.date}</span>
</div>`
}

let commentsRender = fetchedData => {
  var dcCrediv = document.createDocumentFragment()

  if (!fetchedData.comments) return [0, dcCrediv]
  for (var i = 0; i < fetchedData.comments.length; i++) {
    var c = fetchedData.comments[i]
    // 댓글돌이일 경우 건너 뜀
    if (c.nicktype === 'COMMENT_BOY') continue

    var getIcon = new DOMParser().parseFromString(c.gallog_icon, 'text/html')
    var imgElem = getIcon.getElementsByTagName('img')[0]

    var postData = {
      nick: c.name,
      unique_id: c.user_id,
      ip_addr: c.ip,
      date: c.reg_date,
      nickType: iconParse(imgElem ? imgElem.src : '')
    }

    var cs = document.createElement('div')
    cs.className = '__hoverBox_commentWraps __hoverBox_pushLeft' + c.depth
    cs.innerHTML = renderNicks(postData)

    var commentContent = document.createElement('div')
    commentContent.className = '__hoverBox_commentContent'

    var getIcon = new DOMParser().parseFromString(c.memo, 'text/html')
    var checkDcCon = getIcon.getElementsByTagName('img')

    if (checkDcCon[0]) {
      var dcConElem = document.createElement('img')
      dcConElem.src = checkDcCon[0].src
      dcConElem.className = '__hoverBox_dccon __hoverBox_dcconLoading'
      dcConElem.onload = () => {
        dcConElem.classList.toggle('__hoverBox_dcconLoading')
      }
      commentContent.appendChild(dcConElem)
    } else {
      commentContent.innerHTML = c.memo
    }

    cs.appendChild(commentContent)

    dcCrediv.appendChild(cs)
  }

  return [fetchedData.total_cnt, dcCrediv]
}

/**
 * 디시 서버에 개념글 추천 요청을 보냅니다.
 *
 * @param {Boolean} is_up 개념글 추천 버튼인가?
 * @param {*} gall_id 갤러리 ID
 * @param {*} post_id 게시글 ID
 */
let pressRecommend = async (is_up, gall_id, post_id, code) => {
  let response = await fetch('https://gall.dcinside.com/board/recommend/vote', {
    method: 'POST',
    async: false,
    crossDomain: true,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    cache: 'no-store',
    body: `ci_t=${getCookie('ci_c')}&id=${gall_id}&no=${post_id}&mode=${
      is_up ? 'U' : 'D'
    }&code_recommend=${code}`
  })

  let gottenData = response.text()

  if (gottenData) {
    let parsedResponse = gottenData.split('|')
    return parsedResponse
  } else {
    return false
  }
}

/**
 * DC인사이드 쿠키 저장 스크립트
 * @param {*} cname
 * @param {*} cvalue
 * @param {*} exdays
 * @param {*} domain
 */
var setCookie = function (cname, cvalue, exdays, domain) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie =
    cname + '=' + cvalue + ';' + expires + ';path=/;domain=' + domain
}

/**
 * 디시인사이드 API를 이용해 댓글을 받아옵니다.
 * @param {*} gall_id 갤러리 ID
 * @param {*} post_id 게시글 ID
 * @param {*} esno ESNO csrf_token
 */
let fetchComments = async (gall_id, post_id, esno) => {
  let response = await fetch('https://gall.dcinside.com/board/comment/', {
    method: 'POST',
    dataType: 'json',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    cache: 'no-store',
    referrer: `https://gall.dcinside.com/${
      isMinor ? 'mgallery/' : ''
    }board/view/?id=${gall_id}&no=${post_id}&page=${pgNum}`,
    body: `id=${gall_id}&no=${post_id}&cmt_id=${gall_id}&cmt_no=${post_id}&e_s_n_o=${esno}&comment_page=1&sort=`
  })

  return await response.json()
}

/**
 * 디시인사이드 페이지에 GET 요청을 보내 게시글을 가져옵니다.
 * @param {HTMLElement} div 가져온 값을 적용할 HTMLElement
 * @param {String} id 게시글의 ID값
 */
let fetchPostInfo = async (div, id) => {
  let response = await fetch(
    'https://gall.dcinside.com/' +
      (isMinor ? 'mgallery/' : '') +
      'board/view/?id=' +
      pgId +
      '&no=' +
      id,
    { method: 'GET', mode: 'cors', cache: 'no-store' }
  )

  let domPs = new DOMParser().parseFromString(
    await response.text(),
    'text/html'
  )
  let postData = getInfofromDocument(domPs, id)
  div.innerHTML = ''
  let cntWrap = document.createElement('div')
  cntWrap.className = '__hoverBox_contentWrap'

  var headers = document.createElement('div')
  headers.className = '__hoverBox_header'
  headers.innerHTML = `
    <span class="__hoverBox_postTitle">${postData.title}</span>
    ${renderNicks(postData)}
  `
  cntWrap.appendChild(headers)

  let fetchedWrittingBox = domPs.getElementsByClassName('writing_view_box')
  fetchedWrittingBox[0].style.float = 'unset'
  fetchedWrittingBox[0].style.maxWidth = 'unset'
  fetchedWrittingBox[0].style.width = '100%'
  cntWrap.appendChild(fetchedWrittingBox[0])

  var bottomContents = document.createElement('div')
  bottomContents.className = '__hoverBox_bottom'
  bottomContents.innerHTML = `
    ${
  postData.voteCodeImage
    ? `
      <div class="__hoverBox_voteCodeWrap">
        <img src="${postData.voteCodeImage}"></img>
        <input type="text" id="__hoverBox_voteCodeTexts"></input>
      </div>
    `
    : ''
}
    <div class="__hoverBox_voteWrap">
      <div class="__hoverBox_upvoteWrap" id="__hoverBox_upvoteId_${id}">
        <img src="${chrome.extension.getURL(
    '/icns/upvote.png'
  )}" class="__hoverBox_voteIcon"></img>
        <div class="__hoverBox_upvoteCounts" id="__hoverBox_upvoteBtn">${
  postData.upvotes
}</div>
      </div>
      <div class="__hoverBox_downvoteWrap" id="__hoverBox_downvoteId_${id}">
        <img src="${chrome.extension.getURL(
    '/icns/downvote.png'
  )}" class="__hoverBox_voteIcon"></img>
        <div class="__hoverBox_downvoteCounts" id="__hoverBox_downvoteBtn">${
  postData.downvotes
}</div>
      </div>
    </div>
    <div class="__hoverBox_seperater"></div>
  `

  var ftchCmts = await fetchComments(
    pgId,
    id,
    domPs.getElementById('e_s_n_o').value
  )
  var renderedComments = commentsRender(ftchCmts)
  var bottomComments = document.createElement('div')
  bottomComments.className = '__hoverBox_comment'
  bottomComments.append(renderedComments[1])

  cntWrap.appendChild(bottomContents)
  cntWrap.appendChild(bottomComments)
  div.appendChild(cntWrap)

  document
    .getElementById('__hoverBox_upvoteId_' + id)
    .addEventListener('click', () => {
      pressRecommend(true, pgId, id)
    })

  document
    .getElementById('__hoverBox_downvoteId_' + id)
    .addEventListener('click', () => {
      pressRecommend(false, pgId, id)
    })
}

let renderErrorPage = (div, code, msg) => {
  div.innerHTML = `<div class="__hoverBox_error">
  <h3 class="__hoverBox_errTitle">오류 발생</h3>
  <p>글을 받아와 파싱하려는 도중 오류가 발생 하였습니다.</p>
  <br>
  <p class="__hoverBox_muteText">${msg}</p>
  </div>`
}

/**
 * 오른쪽 클릭시 오버레이 생성
 * @param {DocumentFragment} t 파싱된 게시판 HTML 소스
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
        recalcLeftRight(createdOverlay, ev.clientX - 5, ev.clientY - 5)

        try {
          await fetchPostInfo(createdOverlay, postId)
        } catch (e) {
          renderErrorPage(createdOverlay, e.code, e.message)
        }
        recalcLeftRight(createdOverlay, ev.clientX - 5, ev.clientY - 5)

        return ev.preventDefault()
      })
    })(postBox[z], postId)
  }
}

/**
 * 로딩 중인 경우, 로더로 채웁니다.
 * @param {HTMLElement} div
 */
let fillWithLoader = div => {
  div.innerHTML = ''
  var outerLoader = document.createElement('div')
  outerLoader.className = '__hoverBox_loader'

  var loaderRing = document.createElement('div')
  loaderRing.className = '__hoverBox_dual-ring'

  outerLoader.appendChild(loaderRing)
  div.appendChild(outerLoader)
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

  setCookie('_gat_mgall_web', 1, 3, 'dcinside.com')

  if (
    /\/board\/lists/g.test(window.location.href) ||
    /\/board\/view/g.test(window.location.href)
  ) {
    gTableOrigin = document.getElementsByClassName('gall_list')[0]
  }

  addNewCaching(gTableOrigin, true)
  addHoverListener(gTableOrigin)

  var YuSikDaeJangMandooZoGong = () => {}
  if (
    (/board\/view/g.test(window.location.href) ||
      /board\/lists/g.test(window.location.href)) &&
    pgId != null
  ) {
    setInterval(() => {
      if (!window.navigator.onLine) return false

      try {
        fetch(fetchURL, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store'
        }).then(async response => {
          let domPs = new DOMParser().parseFromString(
            await response.text(),
            'text/html'
          )

          let gTable = domPs.getElementsByClassName('gall_list')[0]
          addNewCaching(gTable, false)
          gTableOrigin.innerHTML = ''
          gTableOrigin.append(gTable)
          addHoverListener(gTableOrigin)
        })
      } catch (e) {
        YuSikDaeJangMandooZoGong()
      }
    }, 5000)
  }
})

chrome.browserAction.setPopup({ popup: 'dc_refresh.html' })
