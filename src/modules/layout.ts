export default {
  name: '레이아웃 수정',
  description: '디시 레이아웃을 변경할 수 있도록 도와줍니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  url: /board\/lists/g,
  status: {
    responsive: true
    // narrowScreenMode: true
  },
  memory: {
    uuid: null
  },
  // settings: {
  //   narrowScreenMode: {
  //     name: '좁은 화면에서 활성화',
  //     desc: '좁은 화면 (900px 이하) 에서 레이아웃 변경을 활성화합니다.',
  //     type: 'check',
  //     default: true,
  //     advanced: false
  //   }
  // },
  enable: true,
  default_enable: true,
  require: ['filter'],
  func (filter: RefresherFilter) {
    document.documentElement.classList.add('refresherResponsive')

    this.memory.uuid = filter.add('html', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherResponsive') == -1) {
        elem.className += ' refresherResponsive'
      }
    })

    filter.runSpecific(this.memory.uuid)
  },

  revoke (filter: RefresherFilter) {
    if (
      document.documentElement.className.indexOf('refresherResponsive') > -1
    ) {
      document.documentElement.classList.remove('refresherResponsive')
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }
  }
}
