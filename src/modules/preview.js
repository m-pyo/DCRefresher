const queryString = require('../utils/query')
const User = require('../structs/user')
const PostInfo = require('../structs/post')

/**
 * dcinside.com set cookie function
 * @param {*} e
 * @param {*} t
 * @param {*} o
 * @param {*} i
 */
function set_cookie_tmp (e, t, o, i) {
  var n = new Date()
  n.setTime(n.getTime() + 36e5 * o),
    (document.cookie =
      e +
      '=' +
      escape(t) +
      '; path=/; domain=' +
      i +
      '; expires=' +
      n.toGMTString() +
      ';')
}

/**
 * dcinside.com get cookie
 * @param {*} e
 */
function get_cookie (e) {
  for (
    var t = e + '=', o = document.cookie.split(';'), i = 0;
    i < o.length;
    i++
  ) {
    for (var n = o[i]; ' ' == n.charAt(0); ) n = n.substring(1)
    if (0 == n.indexOf(t)) return n.substring(t.length, n.length)
  }
  return ''
}

/**
 * DC인사이드 쿠키 저장 스크립트
 * @param {String} cname
 * @param {String} cvalue
 * @param {Number} exdays
 * @param {String} domain
 */
var setCookie = function (cname, cvalue, exdays, domain) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie =
    cname + '=' + cvalue + ';' + expires + ';path=/;domain=' + domain
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

;(() => {
  const findNeighbor = (el, find, max, current) => {
    if (!find) {
      return el
    }

    if (current && current > max) {
      return null
    }

    if (!current) {
      current = 0
    }

    if (el.parentElement) {
      let query = el.parentElement.querySelector(find)

      if (!query) {
        current++

        return findNeighbor(el.parentElement, find, max, current)
      }

      return query
    }

    return null
  }

  let MODULE = {
    name: '미리보기',
    description: '글을 오른쪽 클릭 했을때 미리보기 창을 만들어줍니다.',
    author: 'Sochiru',
    status: false,
    memory: {
      preventOpen: false
    },
    enable: true,
    default_enable: true,
    require: ['filter', 'eventBus', 'Frame', 'http'],
    func (filter, eventBus, Frame, http) {
      setCookie('_gat_mgall_web', 1, 3, 'dcinside.com')

      let parse = (id, body) => {
        let dom = new DOMParser().parseFromString(body, 'text/html')

        let header = (
          dom.querySelector(
            '.view_content_wrap > header > div > h3 > span.title_headtext'
          ) || {}
        ).innerHTML

        if (header) {
          header = header.replace(/(\[|\])/g, '')
        }

        let title = dom.querySelector(
          '.view_content_wrap > header > div > h3 > span.title_subject'
        ).innerHTML

        let date = dom.querySelector(
          '.view_content_wrap > header > div > div > div.fl > span.gall_date'
        ).innerHTML

        let views = dom
          .querySelector(
            '.view_content_wrap > header > div > div > div.fr > span.gall_count'
          )
          .innerHTML.replace(/조회\s/, '')
        let upvotes = dom
          .querySelector(
            '.view_content_wrap > header > div > div > div.fr > span.gall_reply_num'
          )
          .innerHTML.replace(/추천\s/, '')

        let downvotes = dom.querySelector(
          'div.btn_recommend_box.clear .down_num'
        ).innerHTML

        let contents = dom.querySelector(
          '.view_content_wrap > div > div.inner.clear > div.writing_view_box'
        ).innerHTML
        let comments = []

        return new PostInfo(id, {
          header,
          title,
          date,
          user: new User().import(
            dom.querySelector(
              'div.view_content_wrap > header > div > div.gall_writer'
            )
          ),
          views,
          upvotes,
          downvotes,
          contents,
          comments
        })
      }

      let makeVoteRequest = async (gall_id, post_id, type, code, link) => {
        set_cookie_tmp(
          gall_id + post_id + '_Firstcheck' + (!type ? '_down' : ''),
          'Y',
          3,
          'dcinside.com'
        )

        return http
          .make(http.urls.vote, {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            cache: 'no-store',
            referrer: link,
            referrerPolicy: 'unsafe-url',
            body: `ci_t=${get_cookie(
              'ci_c'
            )}&id=${gall_id}&no=${post_id}&mode=${
              type ? 'U' : 'D'
            }&code_recommend=${code}`
          })
          .then(v => {
            let res = v.split('||')

            return {
              result: res[0],
              counts: res[1],
              fixed_counts: res[2]
            }
          })
      }

      let makeFirstFrame = (ev, frame, gall, id, title, link) => {
        frame.setData('load', true)
        frame.title = title
        frame.buttons = true

        frame.voteFunction = async type => {
          let res = await makeVoteRequest(
            queryString('id'),
            id,
            type,
            null,
            link
          )

          if (res.result != 'true') {
            alert(res.counts)

            return false
          }

          frame[type ? 'upvotes' : 'downvotes'] = res.counts

          if (type) {
            frame.fixedCounts = res.fixed_counts
          }

          return true
        }

        frame.shareFunction = () => {
          if (!window.navigator.clipboard) {
            alert('이 브라우저는 클립보드 복사 기능을 지원하지 않습니다.')
            return false
          }

          window.navigator.clipboard.writeText(
            `https://gall.dcinside.com/${
              http.checkMinor(link) ? 'mgallery' : 'board'
            }/board/view/?id=${gall || queryString('id')}&no=${id}`
          )

          return true
        }

        http
          .make(
            `${http.urls.gall[http.checkMinor(link) ? 'minor' : 'major'] +
              http.urls.view +
              (gall || queryString('id'))}&no=${id}`
          )
          .then(v => parse(id, v))
          .then(obj => {
            frame.contents = obj.contents
            frame.upvotes = obj.upvotes
            frame.downvotes = obj.downvotes

            frame.user = obj.user
            frame.date = new Date(obj.date)

            eventBus.emit('contentPreview', frame.app)
            frame.setData('load', false)

            obj = undefined
          })
      }

      let makeSecondFrame = (ev, frame, gall, id, title, link) => {
        frame.setData('load', true)
        frame.title = `댓글`
        frame.subtitle = `로딩 중`

        let gall_id = gall || queryString('id')

        let cmt_id
        let cmt_no

        if (window.$) {
          cmt_id = window.$(document).data('comment_id')
          cmt_no = window.$(document).data('comment_no')
        }

        http
          .make(http.urls.comments, {
            method: 'POST',
            dataType: 'json',
            headers: {
              Accept: 'application/json, text/javascript, */*; q=0.01',
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest'
            },
            cache: 'no-store',
            referrer: `https://gall.dcinside.com/${
              http.checkMinor(link) ? 'mgallery/' : ''
            }board/view/?id=${gall_id}&no=${id}`,
            body: `id=${gall_id}&no=${Number(
              id
            )}&cmt_id=${cmt_id || gall_id}&cmt_no=${Number(cmt_no || id)}&e_s_n_o=${
              document.getElementById('e_s_n_o').value
            }&comment_page=1&sort=`
          })
          .then(comments => {
            if (!comments) {
              frame.error = true
            }

            if (comments.comments) {
              comments.comments = comments.comments.filter(v => {
                return v.nicktype !== 'COMMENT_BOY'
              })

              comments.comments.map(v => {
                v.user = new User(
                  v.name,
                  v.user_id,
                  v.ip,
                  (
                    new DOMParser()
                      .parseFromString(v.gallog_icon, 'text/html')
                      .querySelector('a.writer_nikcon img') || {}
                  ).src
                )
              })
            }

            frame.subtitle = `${
              comments.total_cnt !== comments.comment_cnt
                ? `쓰레드 ${comments.comment_cnt}개, 총 댓글 ${comments.total_cnt}`
                : comments.total_cnt
            }개`
            frame.isComment = true
            frame.comments = comments

            frame.setData('load', false)
          })
      }

      let previewFrame = ev => {
        if (this.memory.preventOpen) {
          this.memory.preventOpen = false
          return
        }

        let frame = new Frame(
          [
            {
              relative: true,
              center: true,
              preview: true,
              blur: true
            },

            {
              relative: true,
              center: true,
              preview: true,
              blur: true
            }
          ],
          {
            background: true,
            stack: true,
            groupOnce: true
          }
        )

        let listId = findNeighbor(ev.target, '.gall_num', 5)
        let preId
        let preGall
        let preLink
        let preTitle

        if (!listId) {
          preLink = findNeighbor(ev.target, 'a', 2)
          preId = (preLink.href || '').match(/\&no=.+/)[0].replace('&no=', '')
          preGall = ((preLink.href || '').match(/\id=.+\&/) || '')[0].replace(
            /id=|&/g,
            ''
          )
          preTitle = findNeighbor(ev.target, '.txt_box', 2).innerHTML
        } else {
          preId = listId.innerText
          preLink = findNeighbor(ev.target, 'a:not(.reply_numbox)', 3)
          preTitle = preLink.innerText
        }

        makeFirstFrame(
          ev,
          frame.app.first(),
          preGall,
          preId,
          preTitle,
          preLink.href
        )
        makeSecondFrame(
          ev,
          frame.app.second(),
          preGall,
          preId,
          preTitle,
          preLink.href
        )

        setTimeout(() => {
          frame.app.fadeIn()
        }, 0)

        ev.preventDefault()
      }

      let handleMousePress = ev => {
        if (ev.button != 2) {
          return ev
        }

        if (ev.type === 'mousedown') {
          this.memory.lastPress = Date.now()
          return ev
        }

        if (
          ev.type === 'mouseup' &&
          this.memory.lastPress &&
          Date.now() - 300 > this.memory.lastPress
        ) {
          // TODO : 300 고정 값을 설정에서 바꿀 수 있도록 하기 (마우스 몇초간 누르고 있으면 기본 메뉴 열기)
          this.memory.preventOpen = true
          this.memory.lastPress = 0
          return ev
        }
      }

      this.memory.uuid = filter.add(
        '.left_content article .us-post .ub-word, #right_issuezoom .inner',
        elem => {
          elem.addEventListener('mouseup', handleMousePress)
          elem.addEventListener('mousedown', handleMousePress)
          elem.addEventListener('contextmenu', previewFrame)
        }
      )

      eventBus.on('refresh', e => {
        let elems = e.querySelectorAll(
          '.left_content article .us-post .ub-word'
        )

        let iter = elems.length
        while (iter--) {
          elems[iter].addEventListener('mouseup', handleMousePress)
          elems[iter].addEventListener('mousedown', handleMousePress)
          elems[iter].addEventListener('contextmenu', previewFrame)
        }
      })
    }
  }

  module.exports = MODULE
})()
