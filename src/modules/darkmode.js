;(() => {
  let MODULE = {
    name: '다크 모드',
    description: '디시인사이드 페이지와 DCRefresher의 창을 어두운 색상으로 변경합니다.',
    author: 'Sochiru',
    status: false,
    top: true,
    memory: {},
    enable: true,
    default_enable: false,
    require: ['filter'],
    func(filter) {
      if (document && document.head) {
        let d = document.createElement('style')
        d.innerHTML = `body,.dcwrap,.left_content,.dcfoot,.issuebox,.inner_search {background-color: #222;}`
        document.head.appendChild(d)
      }

      if (document && document.body) {
        document.body.className += ' refresherDark'
      }

      this.memory.uuid = filter.add('body', elem => {
        if (elem.className.indexOf('refresherDark') == -1) {
          elem.className += ' refresherDark'
        }
      })
    }
  }

  module.exports = MODULE
})()
