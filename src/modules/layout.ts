export default {
  name: '레이아웃 수정',
  description: '디시 레이아웃을 변경할 수 있도록 도와줍니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  url: /board\/lists/g,
  status: {
    responsive: true
  },
  memory: {
    uuid: null
  },
  enable: true,
  default_enable: true,
  require: ['filter'],
  func (filter: RefresherFilter) {
    if (document && document.body) {
      document.body.classList.add('refresherResponsive')
    }

    this.memory.uuid = filter.add('body', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherResponsive') == -1) {
        elem.className += ' refresherResponsive'
      }
    })
  },

  revoke (filter: RefresherFilter) {
    if (document.body.className.indexOf('refresherResponsive') > -1) {
      document.body.classList.remove('refresherResponsive')
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }
  }
}
