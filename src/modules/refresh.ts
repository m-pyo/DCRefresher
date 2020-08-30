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
    refresh: 0
  },
  enable: true,
  default_enable: true,
  require: ['http', 'eventBus'],
  func (http, eventBus) {
    let url = http.view(location.href)
    const body = () => {
      return new Promise(async (resolve, reject) => {
        let body = await http.make(url)

        try {
          let bodyParse = new DOMParser().parseFromString(body, 'text/html')
          body = undefined

          resolve(bodyParse.querySelector('.gall_list'))
        } catch (e) {
          reject(e)
        }
      })
    }

    let run = () => {
      if (!this.status.auto_delay) {
        this.memory.delay = Math.max(1000, this.memory.delay || 2500)
      }

      this.memory.refresh = setTimeout(load, this.memory.delay)
    }

    let load = _ => {
      if (!document.hidden) {
        this.memory.new_counts = 0

        body().then(newList => {
          let oldList = document.querySelector('.gall_list')
          if (!oldList) return

          oldList.parentElement.appendChild(newList)
          oldList.parentElement.removeChild(oldList)

          var cached = Array.from(oldList.querySelectorAll('td.gall_num'))
            .map(v => v.innerHTML)
            .join('|')

          oldList = undefined

          newList.querySelectorAll('td.gall_num').forEach(v => {
            if (cached.indexOf(v.innerHTML) == -1) {
              if (this.status.fadeIn) {
                v.parentElement.className += ' refresherNewPost'
                v.parentElement.style.animationDelay =
                  this.memory.new_counts * 23 + 'ms'
              }
              this.memory.new_counts++
            }
          })

          this.memory.average_counts.push(this.memory.new_counts)

          if (this.memory.average_counts.length > AVERAGE_COUNTS_SIZE) {
            this.memory.average_counts.shift()
          }

          let average =
            this.memory.average_counts.reduce((a, b) => a + b) /
            this.memory.average_counts.length

          this.memory.delay = 8 * Math.pow(2 / 3, 3 * average) * 1000

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
