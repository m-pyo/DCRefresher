import * as strings from '../utils/string'
import * as observe from '../utils/observe'

interface RefresherFilteringLists {
  func: Function
  scope: string
  status: { [index: string]: any }
  events: { [index: string]: any }
  options?: RefresherFilteringOptions
  expire?: Function
}

interface RefresherFilteringOptions {
  neverExpire?: boolean
  expireFunc?: Function
}

let lists: { [index: string]: RefresherFilteringLists } = {}

export const filter = {
  __run: async (a: RefresherFilteringLists, e: NodeListOf<Element>) => {
    let iter = e.length

    if (!iter) return false
    while (iter--) {
      await a.func(e[iter])
    }
  },
  /**
   * lists에 등록된 필터 함수를 호출합니다.
   *
   * @param non_blocking 비차단 방식으로 렌더링 합니다. (페이지 로드 후)
   */
  run: async (non_blocking: boolean) => {
    let listsKeys = Object.keys(lists)

    let len = listsKeys.length
    while (len--) {
      let filterObj = lists[listsKeys[len]]

      let observer: any

      if (filterObj.options && filterObj.options.neverExpire) {
        if (lists[listsKeys[len]].expire) {
          lists[listsKeys[len]].expire!()
        }

        observer = observe.listen(
          filterObj.scope,
          document.documentElement,
          (e: NodeListOf<Element>) => {
            filter.__run(filterObj, e)
          }
        )

        lists[listsKeys[len]].expire = () => {
          if (observer) {
            ;(observer as MutationObserver).disconnect()
            observer = null
          }
        }
      } else {
        if (non_blocking) {
          observer = observe.find(filterObj.scope, document.documentElement)
        } else {
          observer = await observe.find(
            filterObj.scope,
            document.documentElement
          )
        }

        Promise.resolve(observer).then(e => filter.__run(filterObj, e))
      }
    }
  },

  runSpecific: (id: string) => {
    let item = lists[id]

    return observe
      .find(item.scope, document.documentElement)
      .then(async e => filter.__run(item, e))
  },

  /**
   * 필터 lists 에 필터 함수를 등록합니다.
   */
  add: (scope: string, cb: Function, options?: RefresherFilteringOptions) => {
    let uuid = strings.uuid()

    if (typeof lists[uuid] === 'undefined') {
      let obj = {
        func: cb,
        scope,
        status: {},
        events: {},
        options
      }

      lists[uuid] = obj
    }

    return uuid
  },

  addGlobal: (id: string, scope: string, cb: Function) => {
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
  remove: (uuid: string, skip?: boolean) => {
    if (skip && typeof lists[uuid] === 'undefined') {
      return
    }

    if (typeof lists[uuid] === 'undefined') {
      throw new Error('Given UUID is not exists in the list.')
    }

    filter.events(uuid, `remove`)

    if (lists[uuid].options && lists[uuid].options?.neverExpire) {
      lists[uuid].expire!()
    }

    delete lists[uuid]
  },

  /**
   * 해당 UUID의 이벤트에 콜백 함수를 등록합니다.
   */
  on: (uuid: string, event: string, cb: Function) => {
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
  events: (uuid: string, event: string, ...args: any[]) => {
    if (uuid == '' || event == '') {
      throw new Error('Given UUID or event is not valid.')
    }

    if (typeof lists[uuid] === 'undefined') {
      throw new Error('Given UUID is not exists in the list.')
    }

    if (typeof lists[uuid].events[event] === 'undefined') {
      return
    }

    let eventObj = lists[uuid].events[event]
    let eventIter = eventObj.length

    while (eventIter--) {
      eventObj[eventIter](...args)
    }
  }
}
