const strings = require('../utils/string.js')
const observe = require('../utils/observe.js')
const log = require('../utils/logger.js')

;(() => {
  let lists = {}

  const filter = {
    __run: async (a, e) => {
      let iter = e.length

      if (!iter) return false
      while (iter--) {
        await a.func(e[iter])
      }
    },
    /**
     * lists에 등록된 필터 함수를 호출합니다.
     *
     * @param {Boolean} non_blocking 비차단 방식으로 렌더링 합니다. (페이지 로드 후)
     */
    run: async non_blocking => {
      let listsKeys = Object.keys(lists)

      let len = listsKeys.length
      while (len--) {
        let filterObj = lists[listsKeys[len]]

        ;(!non_blocking
          ? await observe.find(filterObj.scope, document.documentElement)
          : observe.find(filterObj.scope, document.documentElement)
        ).then(e => filter.__run(filterObj, e))
      }
    },

    runSpecific: id => {
      let item = lists[id]

      observe
        .find(item.scope, document.documentElement)
        .then(async e => filter.__run(item, e))
    },

    /**
     * 필터 lists 에 필터 함수를 등록합니다.
     */
    add: (scope, cb) => {
      let uuid = strings.uuid()

      if (typeof lists[uuid] === 'undefined') {
        lists[uuid] = {
          func: cb,
          scope,
          status: {},
          events: {}
        }
      }

      return uuid
    },

    addGlobal: (id, scope, cb) => {
      lists[id] = {
        func: cb,
        scope,
        status: {},
        events: {}
      }

      return
    },

    /**
     * 필터 lists 에 있는 필터 함수를 제거합니다.
     */
    remove: uuid => {
      if (typeof lists[uuid] === 'undefined') {
        throw new Error('Given UUID is not exists in the list.')
      }

      filter.events(uuid, `remove`)

      delete lists[uuid]
    },

    /**
     * 해당 UUID의 이벤트에 콜백 함수를 등록합니다.
     */
    on: (uuid, event, cb) => {
      if (uuid == '' || event == '') {
        throw new Error('Given UUID or event is not valid.')
      }

      if (typeof lists[uuid] === 'undefined') {
        throw new Error('Given UUID is not exists in the list.')
      }

      if (typeof lists[uuid].events[event] === 'undefined') {
        lists[uuid].events[event] = []
      }

      lists[uuid].events[event].push(cb)
    },

    /**
     * 해당 UUID에 이벤트를 발생시킵니다.
     */
    events: (uuid, event, ...args) => {
      if (uuid == '' || event == '') {
        throw new Error('Given UUID or event is not valid.')
      }

      if (typeof lists[uuid] === 'undefined') {
        throw new Error('Given UUID is not exists in the list.')
      }

      if (typeof lists[uuid].events[event] === 'undefined') {
        throw new Error('Given Event is not exists in the list.')
      }

      let eventObj = lists[uuid].events[event]
      let eventIter = eventObj.length

      while (eventIter--) {
        eventObj[eventIter](...args)
      }
    }
  }

  module.exports = filter
})()
