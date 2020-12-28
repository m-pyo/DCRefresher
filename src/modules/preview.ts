import queryString from '../utils/query'
import { User } from '../structs/user'
import { PostInfo } from '../structs/post'
import { findNeighbor } from '../utils/dom'
import * as http from '../utils/http'
import comment_ads from './comment_ads'

/**
 * dcinside.com set cookie function
 */
function set_cookie_tmp (e: string, t: string, o: number, i: string) {
  var n = new Date()
  n.setTime(n.getTime() + 36e5 * o),
    (document.cookie =
      e +
      '=' +
      escape(t) +
      '; path=/; domain=' +
      i +
      '; expires=' +
      n.toUTCString() +
      ';')
}

/**
 * dcinside.com get cookie
 */
function get_cookie (e: string) {
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

interface GalleryPredata {
  gallery: string
  id: string
  title?: string
  link?: string
}

interface GalleryHTTPRequestArguments {
  gallery: string
  id: string
  commentId?: string
  commentNo?: string
  link?: string
}

const ISSUE_ZOOM_ID = /\$\(document\)\.data\('comment_id'\,\s\'.+'\);/g
const ISSUE_ZOOM_NO = /\$\(document\)\.data\('comment_no'\,\s\'.+'\);/g

const QUOTES = /(["'])(?:(?=(\\?))\2.)*?\1/g

const getRelevantData = (ev: MouseEvent) => {
  let listID = findNeighbor(ev.target as HTMLElement, '.gall_num', 5, null)

  let id = ''
  let gallery = ''
  let title = ''
  let link = ''

  let linkElement: HTMLLinkElement

  if (listID) {
    if (listID.innerText === '공지') {
      id =
        new URLSearchParams(
          findNeighbor(ev.target as HTMLElement, 'a', 5, null)?.getAttribute(
            'href'
          )!
        ).get('no') || ''
    } else {
      id = listID.innerText
    }

    linkElement = findNeighbor(
      ev.target as HTMLElement,
      'a:not(.reply_numbox)',
      3,
      null
    ) as HTMLLinkElement

    if (typeof linkElement !== null) {
      title = linkElement.innerText
    }
  } else {
    linkElement = findNeighbor(
      ev.target as HTMLElement,
      'a',
      2,
      null
    ) as HTMLLinkElement

    let pt = findNeighbor(ev.target as HTMLElement, '.txt_box', 2, null)
    if (pt) {
      title = pt.innerHTML
    }
  }

  if (linkElement) {
    let href = linkElement.href || ''
    let linkNumberMatch = href.match(/\&no=.+/)
    let linkIdMatch = href.match(/\id=.+/)

    if (!linkNumberMatch || !linkIdMatch) {
      return
    }

    id = linkNumberMatch[0].replace('&no=', '').replace(/\&.+/g, '')
    gallery = linkIdMatch[0].replace(/id=/g, '').replace(/\&.+/g, '')
  }

  if (linkElement) {
    link = linkElement.href
  }

  return {
    id,
    gallery,
    title,
    link
  }
}

const request = {
  async vote (
    gall_id: string,
    post_id: string,
    type: string,
    code: string | null,
    link: string
  ) {
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
        body: `ci_t=${get_cookie('ci_c')}&id=${gall_id}&no=${post_id}&mode=${
          type ? 'U' : 'D'
        }&code_recommend=${code}&_GALLTYPE_=${http.galleryTypeName(
          link
        )}&link_id=${gall_id}`
      })
      .then((v: string) => {
        let res = v.split('||')

        return {
          result: res[0],
          counts: res[1],
          fixedCounts: res[2]
        }
      })
  },

  post (link, gallery, id, signal) {
    return http
      .make(
        `${http.urls.base +
          http.galleryType(link, '/') +
          http.urls.view +
          gallery}&no=${id}`,
        { signal }
      )
      .then(response => parse(id, response))
  },

  /**
   * 디시인사이드 서버에 댓글을 요청합니다.
   * @param args
   * @param signal
   */
  async comments (args: GalleryHTTPRequestArguments, signal: AbortSignal) {
    if (!args.link) {
      throw new Error('link 값이 주어지지 않았습니다. (확장 프로그램 오류)')
    }

    let galleryType = http.galleryType(args.link, '/')

    let response = await http.make(http.urls.comments, {
      method: 'POST',
      dataType: 'json',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      cache: 'no-store',
      referrer: `https://gall.dcinside.com/${galleryType}board/view/?id=${args.gallery}&no=${args.id}`,
      body:
        `id=${args.gallery}&no=${Number(args.id)}&cmt_id=${args.commentId ||
          args.gallery}&cmt_no=${Number(args.commentNo || args.id)}&e_s_n_o=${
          (document.getElementById('e_s_n_o')! as HTMLInputElement).value
        }&comment_page=1&sort=&_GALLTYPE_=` + http.galleryTypeName(args.link),
      signal
    })

    return JSON.parse(response)
  }
}

let parse = (id: string, body: string) => {
  let dom = new DOMParser().parseFromString(body, 'text/html')

  let header = dom.querySelector('.view_content_wrap span.title_headtext')
    ?.innerHTML

  if (header) {
    header = header.replace(/(\[|\])/g, '')
  }

  let title = dom.querySelector('.view_content_wrap span.title_subject')
    ?.innerHTML

  let date = dom.querySelector('.view_content_wrap div.fl > span.gall_date')
    ?.innerHTML

  let expire = dom.querySelector(
    '.view_content_wrap div.fl > span.mini_autodeltime > div.pop_tipbox > div'
  )?.innerHTML

  if (expire) {
    expire = expire.replace(/\s자동\s삭제/, '')
  }

  let views = dom
    .querySelector('.view_content_wrap div.fr > span.gall_count')
    ?.innerHTML.replace(/조회\s/, '')
  let upvotes = dom
    .querySelector('.view_content_wrap div.fr > span.gall_reply_num')
    ?.innerHTML.replace(/추천\s/, '')

  let downvotes = dom.querySelector('div.btn_recommend_box.clear .down_num')
    ?.innerHTML

  let contents = dom.querySelector(
    '.view_content_wrap > div > div.inner.clear > div.writing_view_box'
  )?.innerHTML

  let commentId = body
    .match(ISSUE_ZOOM_ID)![0]
    .match(QUOTES)![1]
    .replace(/\'/g, '')

  let commentNo = body
    .match(ISSUE_ZOOM_NO)![0]
    .match(QUOTES)![1]
    .replace(/\'/g, '')

  return new PostInfo(id, {
    header,
    title,
    date,
    expire,
    user: new User('', '', '', '').import(
      dom.querySelector(
        'div.view_content_wrap > header > div > div.gall_writer'
      ) || null
    ),
    views,
    upvotes,
    downvotes,
    contents,
    commentId,
    commentNo
  })
}

export default {
  name: '미리보기',
  description: '글을 오른쪽 클릭 했을때 미리보기 창을 만들어줍니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    preventOpen: false,
    lastPress: 0,
    uuid: null,
    uuid2: null
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'eventBus', 'Frame', 'http'],
  func (
    filter: RefresherFilter,
    eventBus: RefresherEventBus,
    Frame: RefresherFrame,
    http: RefresherHTTP
  ) {
    let makeFirstFrame = (
      frame: RefresherFrame,
      preData: GalleryPredata,
      signal: AbortSignal
    ) => {
      frame.data.load = true
      frame.title = preData.title || ''
      frame.data.buttons = true

      frame.functions.vote = async (type: string) => {
        let res = await request.vote(
          preData.gallery,
          preData.id,
          type,
          null,
          preData.link || ''
        )

        if (res.result != 'true') {
          alert(res.counts)

          return false
        }

        frame[type ? 'upvotes' : 'downvotes'] = res.counts

        return true
      }

      frame.functions.share = () => {
        if (!window.navigator.clipboard) {
          alert('이 브라우저는 클립보드 복사 기능을 지원하지 않습니다.')
          return false
        }

        window.navigator.clipboard.writeText(
          `https://gall.dcinside.com/${http.galleryType(
            preData.link
          )}/board/view/?id=${preData.gallery || queryString('id')}&no=${
            preData.id
          }`
        )

        return true
      }

      frame.functions.load = () => {
        frame.data = {}
        frame.data.load = true

        request
          .post(
            preData.link,
            preData.gallery || queryString('id'),
            preData.id,
            signal
          )
          .then((obj: any) => {
            if (!obj) {
              return
            }

            frame.contents = obj.contents
            frame.upvotes = obj.upvotes
            frame.downvotes = obj.downvotes

            if (frame.title !== obj.title) {
              frame.title = obj.title
            }

            frame.data.user = obj.user
            frame.data.date = new Date(obj.date)
            frame.data.expire = obj.expire
            frame.data.buttons = true

            eventBus.emit(
              'RefresherPostCommentIDLoaded',
              obj.commentId,
              obj.commentNo
            )
            eventBus.emitNextTick('contentPreview', frame.app.$el)

            frame.data.load = false
          })
          .catch((e: Error) => {
            frame.data.error = {
              title: '게시글',
              detail: e.message || e || '알 수 없는 오류'
            }
            frame.data.load = false
          })
      }

      frame.functions.load()
      frame.functions.retry = frame.functions.load
    }

    let makeSecondFrame = (
      frame: RefresherFrame,
      preData: GalleryPredata,
      signal: AbortSignal
    ) => {
      frame.data.load = true
      frame.title = `댓글`
      frame.subtitle = `로딩 중`

      new Promise<GalleryPredata>((resolve, _) => {
        if (preData.gallery !== 'issuezoom') {
          resolve({
            gallery: preData.gallery,
            id: preData.id
          })

          return
        }

        eventBus.on(
          'RefresherPostCommentIDLoaded',
          (commentId: string, commentNo: string) => {
            resolve({
              gallery: commentId,
              id: commentNo
            })
          },
          {
            once: true
          }
        )
      }).then(postData => {
        frame.functions.load = () => {
          frame.data.error = false

          request
            .comments(
              {
                link: preData.link || location.href,
                gallery: preData.gallery,
                id: preData.id,
                commentId: postData.gallery,
                commentNo: postData.id
              },
              signal
            )
            .then((comments: { [index: string]: any }) => {
              if (!comments) {
                frame.data.error = {
                  detail: 'No comments'
                }
              }

              let threadCounts = 0

              if (comments.comments) {
                comments.comments = comments.comments.filter(
                  (v: { [index: string]: any }) => {
                    return v.nicktype !== 'COMMENT_BOY'
                  }
                )

                comments.comments.map((v: { [index: string]: any }) => {
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
                  .map((v: { [index: string]: any }) => Number(v.depth == 0))
                  .reduce((a: number, b: number) => a + b)
              }

              frame.subtitle = `${(comments.total_cnt !== threadCounts &&
                `쓰레드 ${threadCounts}개, 총 댓글`) ||
                ''} ${comments.total_cnt}개`

              frame.data.comments = comments
              frame.data.load = false
            })
            .catch((e: Error) => {
              frame.subtitle = ``

              frame.data.error = {
                title: '댓글',
                detail: e.message || e || '알 수 없는 오류'
              }
            })
        }

        frame.functions.load()
        frame.functions.retry = frame.functions.load
      })
    }

    let previewFrame = (ev: MouseEvent) => {
      if (this.memory.preventOpen) {
        this.memory.preventOpen = false

        return
      }

      let preData = getRelevantData(ev)

      if (!preData) {
        return
      }

      let controller = new AbortController()
      let { signal } = controller

      let lastScroll = 0
      let scrolledCount = 0

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
          onScroll: (ev: any, app: any, group: HTMLElement) => {
            console.log(ev)

            let scrolledToBottom =
              group.scrollHeight - group.scrollTop === group.clientHeight

            if (scrolledToBottom && ev.deltaY > 0 && lastScroll) {
              if (lastScroll + 300 > Date.now()) {
                lastScroll = Date.now()
                return
              }

              console.log(app.$data)

              app.$data.scrollMode = true

              if (scrolledCount < 6) {
                scrolledCount++
                return
              }

              lastScroll = 0
              scrolledCount = 0

              let firstApp = frame.app.first()
              let secondApp = frame.app.second()

              if (firstApp.data.load) {
                return
              }

              if (!preData) {
                return
              }

              if (!firstApp.data.error) {
                preData.id = (Number(preData.id) + 1).toString()
              }

              preData.title = '다음 게시글 로딩 중...'
              firstApp.contents = ''

              group.scrollTop = 0

              app.$data.scrollMode = false

              makeFirstFrame(firstApp, preData, signal)
              makeSecondFrame(secondApp, preData, signal)
            }

            lastScroll = Date.now()

            // TODO : Implement macOS, Windows scroll bending
            // if (group.scrollTop === 0 || group.scrollTop + window.innerHeight >= group?.scrollHeight) {
            //   group.style.top = (ev.deltaY * -1) + 'px'
            // }
          }
        }
      )

      frame.app.$on('close', () => {
        controller.abort()
      })

      makeFirstFrame(frame.app.first(), preData, signal)
      makeSecondFrame(frame.app.second(), preData, signal)

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

    let addHandler = (e: HTMLElement) => {
      e.addEventListener('mouseup', handleMousePress)
      e.addEventListener('mousedown', handleMousePress)
      e.addEventListener('contextmenu', previewFrame)
    }

    this.memory.uuid = filter.add(
      '.left_content article .us-post .ub-word',
      addHandler
    )

    this.memory.uuid2 = filter.add('#right_issuezoom', addHandler)

    eventBus.on('refresh', (e: HTMLElement) => {
      let elems = e.querySelectorAll('.left_content article .us-post .ub-word')

      let iter = elems.length
      while (iter--) {
        addHandler(elems[iter] as HTMLElement)
      }
    })
  }
}
