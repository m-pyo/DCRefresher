;(() => {
  let MODULE = {
    name: '폰트 교체',
    description: '글 목록에 표시되는 폰트를 교체합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    require: ['filter'],
    func (filter) {
      this.memory.uuid = filter.add('body', elem => {
        if (elem.className.indexOf('refresherFont') == -1) {
          elem.className += ' refresherFont'
        }
      })
    }
  }

  module.exports = MODULE
})()
