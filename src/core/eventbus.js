const strings = require('../utils/string.js')

;(() => {
  let lists = {}

  const eventBus = {
    /**
     * lists에 등록된 이벤트 콜백을 호출합니다.
     *
     * @param {String} 호출 할 이벤트 이름.
     * @param {*} 호출 할 이벤트에 넘길 인자.
     */
    emit: (event, ...params) => {
      if (!lists[event]) {
        return
      }

      let remove_queue = []

      let iter = lists[event].length
      while (iter--) {
        let callback = lists[event][iter]
        callback.func(...params)

        if (callback.once) {
          remove_queue.push(iter)
        }
      }

      remove_queue.map((v, i) => {
        lists[event].splice(v - i, 1)
      })
    },

    emitNextTick: (event, ...params) => {
      return requestAnimationFrame(() => eventBus.emit(event, ...params))
    },

    /**
     * lists에 등록된 이벤트 콜백을 호출하면서 생긴 값을 반환합니다.
     *
     * @param {String} 호출 할 이벤트 이름.
     * @param {*} 호출 할 이벤트에 넘길 인자.
     * @returns {Promise} 모든 이벤트가 종료되기 전까지 대신 받을 Promise.
     */
    emitForResult: (event, ...params) => {
      if (!lists[event]) {
        throw new Error('Given event is not defined.')
      }

      return new Promise(async (resolve, reject) => {
        let results = []

        let remove_queue = []

        let iter = lists[event].length
        while (iter--) {
          let callback = lists[event][iter]

          try {
            results.push(await callback.func(...params))
          } catch (e) {
            reject(e)
          }
        }

        remove_queue.map((v, i) => {
          lists[event].splice(v - i, 1)
        })

        resolve(results)
      })
    },

    /**
     * lists 에 이벤트 콜백을 등록합니다.
     *
     * @param {String} event 등록 될 이벤트 이름.
     * @param {Function} cb 나중에 호출 될 이벤트 콜백 함수.
     * @param {Object} options 이벤트에 등록할 옵션.
     */
    on: (event, cb, options) => {
      let uuid = strings.uuid()

      if (typeof lists[event] === 'undefined') {
        lists[event] = []
      }

      let obj = {
        func: cb,
        uuid
      }

      if (options && options.once) {
        obj.once = true
      }

      lists[event].push(obj)

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
