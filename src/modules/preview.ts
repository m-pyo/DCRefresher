import queryString from '../utils/query'
import { User } from '../structs/user'
import { PostInfo } from '../structs/post'
import { findNeighbor } from '../utils/dom'

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
 * 디시인사이드 쿠키 저장 스크립트
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

export default {
  name: '미리보기',
  description: '글을 오른쪽 클릭 했을때 미리보기 창을 만들어줍니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    preventOpen: false,
    lastPress: 0,
    uuid: null
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'eventBus', 'Frame', 'http'],
  func (filter: RefresherFilter, eventBus: RefresherEventBus, Frame, http) {
    setCookie('_gat_mgall_web', 1, 3, 'dcinside.com')

    let parse = (id: string, body: string) => {
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
      )?.innerHTML

      let date = dom.querySelector(
        '.view_content_wrap > header > div > div > div.fl > span.gall_date'
      )?.innerHTML

      let views = dom
        .querySelector(
          '.view_content_wrap > header > div > div > div.fr > span.gall_count'
        )
        ?.innerHTML.replace(/조회\s/, '')
      let upvotes = dom
        .querySelector(
          '.view_content_wrap > header > div > div > div.fr > span.gall_reply_num'
        )
        ?.innerHTML.replace(/추천\s/, '')

      let downvotes = dom.querySelector('div.btn_recommend_box.clear .down_num')
        ?.innerHTML

      let contents = dom.querySelector(
        '.view_content_wrap > div > div.inner.clear > div.writing_view_box'
      )?.innerHTML
      let comments: any[] = []

      return new PostInfo(id, {
        header,
        title,
        date,
        user: new User('', '', '', '').import(
          dom.querySelector(
            'div.view_content_wrap > header > div > div.gall_writer'
          ) || null
        ),
        views,
        upvotes,
        downvotes,
        contents,
        comments
      })
    }

    let makeVoteRequest = async (
      gall_id: string,
      post_id: string,
      type: string,
      code: string | null,
      link: string
    ) => {
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
          body: `ci_t=${get_cookie('ci_c')}&id=${gall_id}&no=${post_id}&mode=${
            type ? 'U' : 'D'
          }&code_recommend=${code}`
        })
        .then((v: string) => {
          let res = v.split('||')

          return {
            result: res[0],
            counts: res[1],
            fixed_counts: res[2]
          }
        })
    }

    let waitPost: Function | null

    let makeFirstFrame = (
      frame,
      gall: string,
      id: string,
      title: string,
      link: string
    ) => {
      frame.setData('load', true)
      frame.title = title
      frame.buttons = true

      frame.voteFunction = async (type: string) => {
        let res = await makeVoteRequest(
          queryString('id')!,
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
          `https://gall.dcinside.com/${http.galleryType(
            link
          )}/board/view/?id=${gall || queryString('id')}&no=${id}`
        )

        return true
      }

      http
        .make(
          `${http.urls.gall[http.galleryType(link)] +
            http.urls.view +
            (gall || queryString('id'))}&no=${id}`
        )
        .then((v: string) => {
          if (typeof waitPost === 'function') {
            waitPost(v)
          }

          return parse(id, v)
        })
        .then((obj: any) => {
          frame.contents = obj.contents
          frame.upvotes = obj.upvotes
          frame.downvotes = obj.downvotes

          frame.user = obj.user
          frame.date = new Date(obj.date)

          frame.setData('load', false)

          eventBus.emitNextTick('contentPreview', frame.app.$el)

          obj = undefined
        })
    }

    // TODO : 페이지네이션 구현
    let requestComment = (
      frame: any,
      link: string,
      gall_id: string,
      id: string,
      cmt_id: string,
      cmt_no: string
    ) => {
      let galleryType = http.galleryType(link, '/')

      http
        .make(http.urls.comments, {
          method: 'POST',
          dataType: 'json',
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          cache: 'no-store',
          referrer: `https://gall.dcinside.com/${galleryType}board/view/?id=${gall_id}&no=${id}`,
          body:
            `id=${gall_id}&no=${Number(id)}&cmt_id=${cmt_id ||
              gall_id}&cmt_no=${Number(cmt_no || id)}&e_s_n_o=${
              (document.getElementById('e_s_n_o')! as HTMLInputElement).value
            }&comment_page=1&sort=&_GALLTYPE_=` +
            http.commentGallTypes[galleryType.replace(/\//g, '')]
        })
        .then((comments: any) => {
          if (!comments) {
            frame.error = true
          }

          let threadCounts = 0

          if (comments.comments) {
            comments.comments = comments.comments.filter(v => {
              return v.nicktype !== 'COMMENT_BOY'
            })

            comments.comments.map(v => {
              v.user = new User(
                v.name,
                v.user_id,
                v.ip || '',
                ((new DOMParser()
                  .parseFromString(v.gallog_icon, 'text/html')
                  .querySelector('a.writer_nikcon img') ||
                  {})! as HTMLImageElement).src
              )
            })

            threadCounts = comments.comments
              .map(v => v.depth)
              .reduce((a, b) => a + b)
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

    let makeSecondFrame = (
      frame,
      gall: string,
      id: string,
      title: string,
      link: string
    ) => {
      frame.setData('load', true)
      frame.title = `댓글`
      frame.subtitle = `로딩 중`

      let gall_id = gall || queryString('id')

      if (gall_id === 'issuezoom') {
        waitPost = (v: string) => {
          let datmatch = /(["'])(?:(?=(\\?))\2.)*?\1/g
          let id_match = v
            .match(/\$\(document\)\.data\('comment_id'\,\s\'.+'\);/g)![0]
            .match(datmatch)![1]
            .replace(/\'/g, '')

          let comment_no = v
            .match(/\$\(document\)\.data\('comment_no'\,\s\'.+'\);/g)![0]
            .match(datmatch)![1]
            .replace(/\'/g, '')

          requestComment(frame, link, gall_id!, id, id_match, comment_no)
        }

        return
      }

      requestComment(frame, link, gall_id!, id, gall_id!, id)
    }

    let previewFrame = (ev: MouseEvent) => {
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
          groupOnce: true,
          onScroll: (ev, app, group: HTMLElement) => {
            // TODO : Implement macOS, Windows scroll bending
            // if (group.scrollTop === 0 || group.scrollTop + window.innerHeight >= group?.scrollHeight) {
            //   group.style.top = (ev.deltaY * -1) + 'px'
            // }
          }
        }
      )

      let listId = findNeighbor(ev.target as HTMLElement, '.gall_num', 5, null)

      let preId = ''
      let preGall = ''
      let preLink: HTMLLinkElement
      let preTitle = ''

      if (!listId) {
        preLink = findNeighbor(
          ev.target as HTMLElement,
          'a',
          2,
          null
        ) as HTMLLinkElement

        if (typeof preLink !== null) {
          preId = (preLink.href || '').match(/\&no=.+/)![0].replace('&no=', '')
          preGall = ((preLink.href || '').match(/\id=.+\&/) || '')[0].replace(
            /id=|&/g,
            ''
          )
        }

        let pt = findNeighbor(ev.target as HTMLElement, '.txt_box', 2, null)
        if (pt !== null) {
          preTitle = pt.innerHTML
        }
      } else {
        preId =
          listId.innerText === '공지'
            ? new URLSearchParams(
                findNeighbor(
                  ev.target as HTMLElement,
                  'a',
                  5,
                  null
                )?.getAttribute('href')!
              ).get('no')
            : listId.innerText
        preLink = findNeighbor(
          ev.target as HTMLElement,
          'a:not(.reply_numbox)',
          3,
          null
        ) as HTMLLinkElement

        if (typeof preLink !== null) {
          preTitle = preLink.innerText
        }
      }

      makeFirstFrame(frame.app.first(), preGall, preId, preTitle, preLink.href)
      makeSecondFrame(
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

    let handleMousePress = (ev: MouseEvent) => {
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
      (elem: HTMLElement) => {
        elem.addEventListener('mouseup', handleMousePress)
        elem.addEventListener('mousedown', handleMousePress)
        elem.addEventListener('contextmenu', previewFrame)
      }
    )

    eventBus.on('refresh', (e: HTMLElement) => {
      let elems = e.querySelectorAll('.left_content article .us-post .ub-word')

      let iter = elems.length
      while (iter--) {
        elems[iter].addEventListener('mouseup', handleMousePress)
        elems[iter].addEventListener('mousedown', handleMousePress)
        elems[iter].addEventListener('contextmenu', previewFrame)
      }
    })
  }
}
