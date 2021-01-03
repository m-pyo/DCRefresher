import { eventBus } from '../core/eventbus'
import { filter } from '../core/filtering'

const AVERAGE_COUNTS_SIZE = 7

let lastAccess = 0

export default {
  name: '글 목록 새로고침',
  description: '글 목록을 자동으로 새로고침합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: {
    refreshRate: undefined,
    useBetterBrowse: undefined,
    fadeIn: undefined,
    autoRate: undefined
  },
  memory: {
    uuid: '',
    uuid2: '',
    cache: {},
    new_counts: 0,
    average_counts: new Array(AVERAGE_COUNTS_SIZE).fill(1),
    delay: 2500,
    refresh: 0,
    calledByPageTurn: false,
    refreshRequest: ''
  },
  enable: true,
  default_enable: true,
  require: ['http', 'eventBus'],
  settings: {
    refreshRate: {
      name: '새로고침 주기',
      desc: '페이지를 새로 고쳐 현재 페이지에 반영하는 주기입니다.',
      type: 'range',
      default: 2500,
      bind: 'delay',
      min: 1000,
      step: 100,
      max: 20000,
      unit: 'ms',
      advanced: false
    },
    autoRate: {
      name: '자동 새로고침 주기',
      desc: '새로 올라오는 글의 수에 따라 새로고침 주기를 자동으로 제어합니다.',
      type: 'check',
      default: true,
      advanced: false
    },
    fadeIn: {
      name: '새 게시글 효과',
      desc: '새로 올라온 게시글에 서서히 등장하는 효과를 줍니다.',
      type: 'check',
      default: true,
      advanced: false
    },
    useBetterBrowse: {
      name: '인페이지 페이지 전환',
      desc:
        '게시글 목록을 다른 페이지로 넘길 때 페이지를 새로 고치지 않고 넘길 수 있게 설정합니다.',
      type: 'check',
      default: true,
      advanced: false
    }
  },
  func (http: RefresherHTTP, eventBus: RefresherEventBus) {
    const body = (url: string) => {
      return new Promise<Element | null>(async (resolve, reject) => {
        let body = await http.make(url)

        try {
          let bodyParse = new DOMParser().parseFromString(body, 'text/html')
          body = undefined

          eventBus.emit('refresherGetPost', bodyParse)

          resolve(bodyParse.querySelector('.gall_list tbody'))
        } catch (e) {
          reject(e)
        }
      })
    }

    let run = () => {
      if (!this.status.autoRate) {
        this.memory.delay = Math.max(1000, this.status.refreshRate || 2500)
      }

      if (this.memory.refresh) {
        clearTimeout(this.memory.refresh)
      }

      this.memory.refresh = window.setTimeout(load, this.memory.delay)
    }

    let isPostView = location.href.indexOf('/board/view') > -1
    let currentPostNo = new URLSearchParams(location.href).get('no')

    let load = async (skipRun?: boolean) => {
      // 도배 방지용
      if (Date.now() - lastAccess < 500) {
        return false
      }

      if (document.hidden) {
        return false
      }
      lastAccess = Date.now()

      let isAdmin = document.querySelector('.useradmin_btnbox button') !== null

      // 글 선택 체크박스에 체크된 경우 새로 고침 건너 뜀
      if (
        isAdmin &&
        Array.from(document.querySelectorAll('.article_chkbox')).filter(
          v => (v as HTMLInputElement).checked
        ).length > 0
      ) {
        return
      }

      this.memory.new_counts = 0

      let url = http.view(location.href)
      let newList = await body(url)

      let oldList = document.querySelector('.gall_list tbody')
      if (!oldList || !newList) return

      let cached = Array.from(oldList.querySelectorAll('td.gall_num'))
        .map(v => v.innerHTML)
        .join('|')

      oldList.parentElement!.appendChild(newList)
      oldList.parentElement!.removeChild(oldList)
      oldList = null

      let postNoIter = newList.querySelectorAll('td.gall_num')

      let containsEmpty = newList.parentElement!.classList.contains('empty')
      if (postNoIter.length) {
        if (containsEmpty) {
          newList.parentElement!.classList.remove('empty')
        }
      } else if (!containsEmpty) {
        newList!.parentElement!.classList.add('empty')
      }

      postNoIter.forEach(v => {
        let value = v.innerHTML

        if (cached.indexOf(value) == -1 && value != currentPostNo) {
          if (this.status.fadeIn && !this.memory.calledByPageTurn) {
            v.parentElement!.className += ' refresherNewPost'
            v.parentElement!.style.animationDelay =
              this.memory.new_counts * 23 + 'ms'
          }
          this.memory.new_counts++
        }

        if (isPostView) {
          if (value === currentPostNo) {
            v.innerHTML = `<span class="sp_img crt_icon"></span>`
            v.parentElement?.classList.add('crt')
          }
        }
      })

      if (this.memory.average_counts && !this.memory.calledByPageTurn) {
        this.memory.average_counts.push(this.memory.new_counts)

        if (this.memory.average_counts.length > AVERAGE_COUNTS_SIZE) {
          this.memory.average_counts.shift()
        }

        let average =
          this.memory.average_counts.reduce((a, b) => a + b) /
          this.memory.average_counts.length

        if (this.status.autoRate) {
          this.memory.delay = Math.max(
            600,
            8 * Math.pow(2 / 3, 3 * average) * 1000
          )
        }
      }

      this.memory.calledByPageTurn = false

      // 미니 갤, 마이너 갤 관리자일 경우 체크박스를 생성합니다.
      if (isAdmin) {
        let noTempl = false
        document.querySelectorAll('.us-post').forEach(elem => {
          let tmpl = document.querySelector('#minor_td-tmpl')

          if (!tmpl) {
            noTempl = true
            return
          }

          elem!.innerHTML = tmpl.innerHTML + elem!.innerHTML
        })

        if (!noTempl) {
          document.querySelectorAll('.ub-content').forEach(elem => {
            if (elem.className.indexOf('us-post') == -1) {
              elem.insertBefore(document.createElement('td'), elem.firstChild)
            }
          })

          if (document.querySelector('#comment_chk_all')) {
            var tbody_colspan = document.querySelector(
              'table.gall_list tbody td'
            )

            if (tbody_colspan) {
              let colspan = tbody_colspan.getAttribute('colspan') || ''

              if (parseInt(colspan) == 6) {
                tbody_colspan?.setAttribute(
                  'colspan',
                  (parseInt(colspan) + 1).toString()
                )
              }
            }
          }
        }
      }

      eventBus.emit('refresh', newList)

      if (!skipRun) {
        run()
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.memory.refresh) {
          clearTimeout(this.memory.refresh)
        }

        return
      }

      load()
    })

    run()

    this.memory.refreshRequest = eventBus.on('refreshRequest', () => {
      if (this.memory.refresh) {
        clearTimeout(this.memory.refresh)
      }

      load()
    })

    if (this.status.useBetterBrowse) {
      this.memory.uuid = filter.add(
        '.left_content .bottom_paging_box a',
        (a: HTMLAnchorElement) => {
          if (a.href.indexOf('javascript:') > -1) {
            return
          }

          a.onclick = () => false
          a.addEventListener('click', async (ev: MouseEvent) => {
            let isPageView = location.href.indexOf('/board/view') > -1

            if (isPageView) {
              history.pushState(
                null,
                document.title,
                http.mergeParamURL(location.href, a.href)
              )
            } else {
              history.pushState(null, document.title, a.href)
            }
            this.memory.calledByPageTurn = true

            await load(true)

            document
              .querySelector(isPageView ? '.view_bottom_btnbox' : '.page_head')!
              .scrollIntoView({ block: 'start', behavior: 'smooth' })
          })
        }
      )

      window.addEventListener('popstate', async _ => {
        this.memory.calledByPageTurn = true
        await load(true)
      })

      this.memory.uuid2 = eventBus.on(
        'refresherGetPost',
        (parsedBody: Document) => {
          let pagingBox = parsedBody.querySelector(
            '.left_content .bottom_paging_box'
          )

          document.querySelector(
            '.left_content .bottom_paging_box'
          )!.innerHTML = pagingBox!.innerHTML
          document
            .querySelectorAll('.left_content .bottom_paging_box a')!
            .forEach(async a => {
              let href = (a as HTMLAnchorElement).href
              if (href.indexOf('javascript:') > -1) {
                return
              }

              ;(a as HTMLAnchorElement).onclick = () => false
              ;(a as HTMLAnchorElement).addEventListener(
                'click',
                async (ev: MouseEvent) => {
                  let isPageView = location.href.indexOf('/board/view') > -1

                  if (isPageView) {
                    history.pushState(
                      null,
                      document.title,
                      http.mergeParamURL(location.href, href)
                    )
                  } else {
                    history.pushState(null, document.title, href)
                  }
                  this.memory.calledByPageTurn = true

                  await load(true)

                  document
                    .querySelector(
                      location.href.indexOf('/board/view') > -1
                        ? '.view_bottom_btnbox'
                        : '.page_head'
                    )!
                    .scrollIntoView({ block: 'start', behavior: 'smooth' })
                }
              )
            })
        }
      )
    }
  },

  revoke () {
    if (this.memory.refresh) {
      clearTimeout(this.memory.refresh)
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid)
    }

    if (this.memory.uuid2) {
      eventBus.remove('refresherGetPost', this.memory.uuid2)
    }

    if (this.memory.refreshRequest) {
      eventBus.remove('refreshRequest', this.memory.refreshRequest)
    }
  }
}
