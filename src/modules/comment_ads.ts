export default {
  name: '댓글 돌이 차단',
  url: /board\/view\/\?id=/g,
  description: '댓글 5칸마다 뜨는 댓글 돌이를 숨깁니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: null
  },
  enable: true,
  default_enable: true,
  require: ['filter'],
  func (filter: RefresherFilter) {
    this.memory.uuid = filter.add('body', (elem: HTMLElement) => {
      elem.classList[this.enable ? 'add' : 'remove']('refresherNoDory')
    })
  },

  remove(filter: RefresherFilter) {
    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }
  }
}
