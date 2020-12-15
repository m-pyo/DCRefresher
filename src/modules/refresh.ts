const AVERAGE_COUNTS_SIZE = 7

export default {
  name: '글 목록 새로고침',
  description: '글 목록을 자동으로 새로고침합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: {
    delay: 2500,
    auto_delay: true,
    fadeIn: true
  },
  memory: {
    cache: {},
    new_counts: 0,
    average_counts: new Array(AVERAGE_COUNTS_SIZE).fill(1),
    delay: 0,
    refresh: 0,
    lastAccess: 0
  },
  enable: true,
  default_enable: true,
  require: ['http', 'eventBus'],
  settings: {
    refreshRate: {
      name: '새로고침 주기',
      desc: '페이지를 새로 고쳐 현재 페이지에 반영하는 주기입니다.',
      type: 'range',
      default: 2500
    }
  },
  func (http: RefresherHTTP, eventBus: RefresherEventBus) {
    let url = http.view(location.href)
    const body = () => {
      return new Promise<Element | null>(async (resolve, reject) => {
        let body = await http.make(url)

        try {
          let bodyParse = new DOMParser().parseFromString(body, 'text/html')
          body = undefined

          resolve(bodyParse.querySelector('.gall_list tbody'))
        } catch (e) {
          reject(e)
        }
      })
    }

    let run = () => {
      if (!this.status.auto_delay) {
        this.memory.delay = Math.max(1000, this.memory.delay || 2500)
      }

      this.memory.refresh = window.setTimeout(load, this.memory.delay)
    }

    let load = () => {
      if (!document.hidden) {
        let isAdmin =
          document.querySelector('.useradmin_btnbox button') !== null

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

        body().then(newList => {
          let oldList = document.querySelector('.gall_list tbody')
          if (!oldList || !newList) return

          oldList.parentElement!.appendChild(newList)
          oldList.parentElement!.removeChild(oldList)

          var cached = Array.from(oldList.querySelectorAll('td.gall_num'))
            .map(v => v.innerHTML)
            .join('|')

          oldList = null

          newList.querySelectorAll('td.gall_num').forEach(v => {
            if (cached.indexOf(v.innerHTML) == -1) {
              if (this.status.fadeIn) {
                v.parentElement!.className += ' refresherNewPost'
                v.parentElement!.style.animationDelay =
                  this.memory.new_counts * 23 + 'ms'
              }
              this.memory.new_counts++
            }
          })

          if (this.memory.average_counts) {
            this.memory.average_counts.push(this.memory.new_counts)

            if (this.memory.average_counts.length > AVERAGE_COUNTS_SIZE) {
              this.memory.average_counts.shift()
            }

            let average =
              this.memory.average_counts.reduce((a, b) => a + b) /
              this.memory.average_counts.length

            this.memory.delay = 8 * Math.pow(2 / 3, 3 * average) * 1000
          }

          // 미니 갤, 마이너 갤 관리자일 경우 체크박스를 생성합니다.
          if (isAdmin) {
            document.querySelectorAll('.us-post').forEach(elem => {
              elem!.innerHTML =
                document.querySelector('#minor_td-tmpl')!.innerHTML +
                elem!.innerHTML
            })

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

          eventBus.emit('refresh', newList)
        })

        run()
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.memory.lastAccess = Date.now()

        if (this.memory.refresh) {
          clearInterval(this.memory.refresh)
        }

        return
      }

      if (Date.now() - (this.memory.lastAccess || 0) > this.memory.delay) {
        load()
      } else {
        run()
      }
    })

    run()
  },

  beforeDestroy () {}
}
