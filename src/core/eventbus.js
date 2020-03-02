const strings = require('../utils/string.js')
const observe = require('../utils/observe.js')

;(() => {
  let lists = {}

  const eventBus = {
    /**
     * lists에 등록된 이벤트 콜백을 호출합니다.
     */
    emit: (event, ...params) => {
      if (!lists[event]) {
        return
      }

      let iter = lists[event].length
      while (iter--) {
        let callback = lists[event][iter]
        callback.func(...params)
      }
    },

    /**
     * lists 에 이벤트 콜백을 등록합니다.
     */
    on: (event, cb) => {
      let uuid = strings.uuid()

      if (typeof lists[event] === 'undefined') {
        lists[event] = []
      }

      lists[event].push({
        func: cb,
        uuid
      })

      return uuid
    },

    /**
     * lists 에 있는 이벤트 콜백을 제거합니다.
     */
    remove: (event, uuid) => {
      if (typeof lists[event] === 'undefined') {
        throw new Error('Given Event is not exists in the list.')
      }

      let callbacks = lists[event]

      let iter = callbacks.length
      while (iter--) {
        if (callbacks[iter].uuid && callbacks[iter].uuid == uuid) {
          callbacks.splice(iter, 1)
          break
        }
      }

      delete lists[uuid]
    }
  }

  module.exports = eventBus
})()
