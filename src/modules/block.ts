import { queryString } from '../utils/http'

export default {
  name: '컨텐츠 차단',
  description: '유저, 컨텐츠 등의 보고 싶지 않은 컨텐츠들을 삭제합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: '',
    selected: {
      nick: '',
      uid: '',
      ip: ''
    },
    lastSelect: 0,
    addBlock: '',
    requestBlock: ''
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'eventBus', 'block', 'dom'],
  func (
    filter: RefresherFilter,
    eventBus: RefresherEventBus,
    block: RefresherBlock,
    dom: RefresherDOM
  ) {
    this.memory.uuid = filter.add(
      '.ub-writer',
      async (elem: HTMLElement) => {
        let gallery = queryString('id')!

        let nick = elem.dataset.nick || ''
        let uid = elem.dataset.uid || ''
        let ip = elem.dataset.ip || ''

        let blockNickname = block.check('NICK', nick, gallery)
        let blockId = block.check('ID', uid, gallery)
        let blockIP = block.check('IP', ip, gallery)

        if (!elem.oncontextmenu) {
          elem.oncontextmenu = _ => {
            this.memory.selected = {
              nick,
              uid,
              ip
            }
            this.memory.lastSelect = Date.now()
          }
        }

        if (
          elem &&
          elem.parentElement &&
          (blockNickname || blockId || blockIP)
        ) {
          let post = elem.parentElement
          if (post && post.className.indexOf('ub-content') > -1) {
            if (post.parentElement) {
              post.parentElement.removeChild(post)
            }
          } else {
            let content = dom.findNeighbor(post, '.ub-content', 3)

            if (content?.parentElement) {
              content.parentElement.removeChild(content)
            }
          }
        }
      },
      {
        neverExpire: true
      }
    )

    this.memory.addBlock = eventBus.on(
      'RefresherAddToBlock',
      (nick: string, uid: string, ip: string) => {
        this.memory.selected = {
          nick,
          uid,
          ip
        }
        this.memory.lastSelect = Date.now()
      }
    )

    this.memory.requestBlock = eventBus.on('RefresherRequestBlock', () => {
      if (Date.now() - this.memory.lastSelect > 10000) {
        return
      }

      let type = 'NICK'
      let value = this.memory.selected.nick
      let extra = this.memory.selected.nick

      if (this.memory.selected.uid) {
        type = 'ID'
        value = this.memory.selected.uid
      } else if (this.memory.selected.ip) {
        type = 'IP'
        value = this.memory.selected.ip
      }

      if (!value || value.length < 1) {
        return
      }

      block.add(type, value, false, undefined, extra)
      alert(`${block.TYPE_NAMES[type]} ${value}을(를) 차단했습니다.`)
    })
  },

  revoke (
    filter: RefresherFilter,
    eventBus: RefresherEventBus,
    block: RefresherBlock,
    dom: RefresherDOM
  ) {
    if (this.memory.uuid) {
      filter.remove(this.memory.uuid)
    }

    if (this.memory.addBlock) {
      filter.remove(this.memory.addBlock)
    }

    if (this.memory.requestBlock) {
      filter.remove(this.memory.requestBlock)
    }
  }
}
