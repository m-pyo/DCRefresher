;(() => {
  let MODULE = {
    name: '다크 모드',
    description: '디시인사이드 페이지와 DCRefresher의 창을 어두운 색상으로 변경합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: false,
    default_enable: false,
    require: ['filter'],
    func(filter) {
      this.memory.uuid = filter.add('body', elem => {
        if (elem.className.indexOf('refresherDark') == -1) {
          elem.className += ' refresherDark'
        }
      })
    }
  }

  module.exports = MODULE
})()
