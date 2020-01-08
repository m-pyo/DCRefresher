const http = require('../utils/http')

;(() => {
  let MODULE = {
    name: '글 목록 새로고침',
    description: '글 목록을 자동으로 새로고침합니다.',
    author: 'Sochiru',
    status: {
      delay: 4000,
      auto_delay: true,
      fadeIn: true
    },
    memory: {
      cache: {}
    },
    enable: true,
    default_enable: true,
    func: filter => {
      const body = () => {
        return new Promise(async (resolve, reject) => {
          let body = await http.make(location.href)

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
        MODULE.memory.delay =
          MODULE.status.delay < 2000 ? 2000 : MODULE.status.delay
        MODULE.memory.refresh = setTimeout(load, MODULE.memory.delay)
      }

      let load = visible => {
        if (!document.hidden) {
          MODULE.memory.newCounts = 0

          body().then(newList => {
            let oldList = document.querySelector('.gall_list')

            oldList.parentElement.appendChild(newList)
            oldList.parentElement.removeChild(oldList)

            if (MODULE.status.fadeIn || true) {
              var cached = Array.from(oldList.querySelectorAll('td.gall_num'))
                .map(v => v.innerHTML)
                .join('|')
              var newListNums = newList.querySelectorAll('td.gall_num')

              newListNums.forEach(v => {
                if (cached.indexOf(v.innerHTML) == -1) {
                  v.parentElement.className += ' refNewPost'
                  v.parentElement.style.animationDelay = MODULE.memory.newCounts * 23 + 'ms'
                  MODULE.memory.newCounts++
                }
              })
            }
          })
        }

        run()
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          MODULE.memory.lastAccess = Date.now()

          if (MODULE.memory.refresh) {
            clearInterval(MODULE.memory.refresh)
          }

          return
        }

        if (
          Date.now() - (MODULE.memory.lastAccess || 0) >
          MODULE.memory.delay
        ) {
          load(true)
        } else {
          run()
        }
      })

      run()
    }
  }

  module.exports = MODULE
})()
