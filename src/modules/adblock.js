;(() => {
  let MODULE = {
    name: '광고 차단',
    description: '페이지 로드 속도를 느리게 만드는 광고를 차단합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    require: ['filter'],
    func (filter) {
      this.memory.uuid = filter.add('body', elem => {
        elem.classList[this.enable ? 'add' : 'remove']('refresherAdblock')
      })

      this.memory.uuidf2 = filter.add('script', elem => {
        if (
          (elem.src &&
            [
              'ads',
              'ad.min.js',
              'addc',
              'ad.about.co.kr',
              'taboola',
              'netinsight'
            ].filter(v => elem.src.indexOf(v) > -1).length) ||
          (!elem.src && elem.innerHTML.indexOf('taboola') > -1)
        ) {
          elem.parentElement.removeChild(elem)
        }
      })

      this.memory.uuidf3 = filter.add('link', elem => {
        if (
          elem.href &&
          ['ads', 'adservice'].filter(v => elem.href.indexOf(v) > -1).length
        ) {
          elem.parentElement.removeChild(elem)
        }
      })
    }
  }

  module.exports = MODULE
})()
