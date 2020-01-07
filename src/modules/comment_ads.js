;(() => {
  let MODULE = {
    name: '댓글 돌이 차단',
    url: /board\/view\/\?id=/g,
    description: '댓글 5칸씩 뜨는 댓글 돌이를 삭제합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    func: filter => {
      MODULE.memory.uuid = filter.add('#comment_li_0, .ub-content .dory', elem => {
        elem.parentElement.removeChild(elem)
      })
    }
  }

  module.exports = MODULE
})()
