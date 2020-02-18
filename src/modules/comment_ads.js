;(() => {
  let MODULE = {
    name: '댓글 돌이 차단',
    url: /board\/view\/\?id=/g,
    description: '댓글 5칸마다 뜨는 댓글 돌이를 삭제합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    require: ['filter'],
    func (filter) {
      this.memory.uuid = filter.add('body', elem => {
        elem.classList[this.enable ? 'add' : 'remove']('refresherNoDory')
      })
    }
  }

  module.exports = MODULE
})()
