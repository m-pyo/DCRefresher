const queryString = require('../utils/query')
const User = require('../structs/user')
const PostInfo = require('../structs/post')

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

      let makeFirstFrame = (ev, frame, id, title) => {
        frame.setData('load', 'true')
        frame.title = title
        frame.buttons = true

        http
          .make(
            `${http.urls.gall[http.checkMinor() ? 'minor' : 'major'] +
              http.urls.view +
              queryString('id')}&no=${id}`
          )
          .then(v => parse(id, v))
          .then(obj => {
            frame.contents = obj.contents
            frame.upvotes = obj.upvotes
            frame.downvotes = obj.downvotes

            frame.setData('load', 'false')
          })
      }

      let makeSecondFrame = (ev, frame, id, title) => {
        frame.setData('load', 'true')
        frame.title = `댓글 <span class="refresher-preview-title-mute">0개</span>`

        let gall_id = queryString('id')

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
              http.checkMinor() ? 'mgallery/' : ''
            }board/view/?id=${gall_id}&no=${id}`,
            body: `id=${gall_id}&no=${Number(
              id
            )}&cmt_id=${gall_id}&cmt_no=${Number(id)}&e_s_n_o=${
              document.getElementById('e_s_n_o').value
            }&comment_page=1&sort=`
          })
          .then(comments => {
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

            frame.isComment = true
            frame.comments = comments

            frame.setData('load', 'false')
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
              preview: true
            },

            {
              relative: true,
              center: true,
              preview: true
            }
          ],
          {
            background: true,
            stack: true,
            groupOnce: true
          }
        )

        let preId = findNeighbor(ev.target, '.gall_num', 5).innerText
        let preTitle = findNeighbor(ev.target, 'a:not(.reply_numbox)', 2)
          .innerText

        makeFirstFrame(ev, frame.app.first(), preId, preTitle)
        makeSecondFrame(ev, frame.app.second(), preId, preTitle)

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
        '.left_content article .us-post .ub-word',
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
