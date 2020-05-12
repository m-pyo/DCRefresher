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
          contents,
          comments
        })
      }

      let previewFrame = ev => {
        if (this.memory.preventOpen) {
          this.memory.preventOpen = false
          return
        }

        let frame = new Frame(
          {
            center: true,
            background: true
          },
          'center preview'
        )

        frame.setData('load', 'true')

        setTimeout(() => {
          frame.fadeIn()
        }, 0)

        let preId = findNeighbor(ev.target, '.gall_num', 5).innerText
        let preTitle = findNeighbor(ev.target, 'a:not(.reply_numbox)', 2)
          .innerText

        frame.innerHTML = `
          <refresher-preview-info>
            <refresher-preview-title>
              ${preTitle}
            </refresher-preview-title>
            <refresher-preview-meta>

            <refresher-preview-meta>
          </refresher-preview-info>
          <refresher-preview-contents>
            <refresher-loader></refresher-loader>
          </refresher-preview-contents>
          <refresher-preview-votes>
            <div>
              <refresher-preview-button class="refresher-upvote">
                <img src="${chrome.extension.getURL('/assets/icons/upvote.png')}"></img>
                <p class="refresher-vote-text">0</p>
              </refresher-preview-button>
              <refresher-preview-button class="refresher-downvote">
                <img src="${chrome.extension.getURL('/assets/icons/downvote.png')}"></img>
                <p class="refresher-vote-text">0</p>
              </refresher-preview-button>
            </div>
          </refresher-preview-votes>
        `

        http
          .make(
            `${http.urls.gall[http.checkMinor() ? 'minor' : 'major'] +
              http.urls.view +
              queryString('id')}&no=${preId}`
          )
          .then(v => parse(preId, v))
          .then(obj => {
            let contents = frame.querySelector('refresher-preview-contents')

            contents.innerHTML = obj.contents
            frame.setData('load', 'false')
          })

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
