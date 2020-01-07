const http = require('../utils/http')

;(() => {
  let MODULE = {
    name: '글 목록 새로고침',
    description: '글 목록을 자동으로 새로고침합니다.',
    author: 'Sochiru',
    status: {
      delay: 4000,
      auto_delay: true
    },
    memory: {},
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

      MODULE.memory.delay =
        MODULE.status.delay < 2000 ? 2000 : MODULE.status.delay
      MODULE.memory.refresh = setInterval(() => {
        body().then(v => {
          let oldList = document.querySelector('.gall_list')

          oldList.parentElement.appendChild(v)
          oldList.parentElement.removeChild(oldList)
        })
      }, MODULE.memory.delay)
    }
  }

  module.exports = MODULE
})()
