export default {
  name: '폰트 교체',
  description: '글 목록에 표시되는 폰트를 교체합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: null
  },
  enable: true,
  default_enable: true,
  require: ['filter'],
  func (filter: RefresherFilter) {
    if (document && document.body) {
      document.body.classList.add('refresherFont')
    }

    this.memory.uuid = filter.add('body', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherFont') == -1) {
        elem.className += ' refresherFont'
      }
    })
  },

  revoke (filter: RefresherFilter) {
    if (document.body.className.indexOf('refresherFont') > -1) {
      document.body.classList.remove('refresherFont')
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }
  }
}
