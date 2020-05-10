;(() => {
  let MODULE = {
    name: '글 목록 새로고침',
    description: '글 목록을 자동으로 새로고침합니다.',
    author: 'Sochiru',
    status: {
      delay: 2500,
      auto_delay: true,
      fadeIn: true
    },
    memory: {
      cache: {}
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

            let listDOM = bodyParse.querySelector('.gall_list')

            resolve(listDOM)
          } catch (e) {
            reject(e)
          }
        })
      }

      let run = () => {
        this.memory.delay = Math.max(2000, this.status.delay || 2500)
        this.memory.refresh = setTimeout(load, this.memory.delay)
      }

      let load = _ => {
        if (!document.hidden) {
          this.memory.newCounts = 0

          body().then(newList => {
            let oldList = document.querySelector('.gall_list')
            if (!oldList) return

            oldList.parentElement.appendChild(newList)
            oldList.parentElement.removeChild(oldList)

            if (this.status.fadeIn) {
              var cached = Array.from(oldList.querySelectorAll('td.gall_num'))
                .map(v => v.innerHTML)
                .join('|')

              var newListNums = newList.querySelectorAll('td.gall_num')

              newListNums.forEach(v => {
                if (cached.indexOf(v.innerHTML) == -1) {
                  v.parentElement.className += ' refresherNewPost'
                  v.parentElement.style.animationDelay =
                    this.memory.newCounts * 23 + 'ms'
                  this.memory.newCounts++
                }
              })
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

  module.exports = MODULE
})()
