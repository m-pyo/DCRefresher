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
            (elem.src.indexOf('ads') > -1 ||
              elem.src.indexOf('ad.min.js') > -1 ||
              elem.src.indexOf('addc') > -1 ||
              elem.src.indexOf('taboola') > -1 ||
              elem.src.indexOf('netinsight') > -1)) ||
          (!elem.src && elem.innerHTML.indexOf('taboola') > -1)
        ) {
          elem.parentElement.removeChild(elem)
        }
      })

      this.memory.uuidf3 = filter.add('link', elem => {
        if (
          elem.href &&
          (elem.href.indexOf('ads') > -1 || elem.href.indexOf('adservice') > -1)
        ) {
          elem.parentElement.removeChild(elem)
        }
      })
    }
  }

  module.exports = MODULE
})()
