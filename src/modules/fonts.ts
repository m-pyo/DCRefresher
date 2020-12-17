export default {
  name: '폰트 교체',
  description: '페이지에 전반적으로 표시되는 폰트를 교체합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: null
  },
  settings: {
    customFonts: {
      name: 'font-family 이름',
      desc:
        '페이지 폰트를 입력된 폰트로 교체합니다. 교체를 원하지 않으면 빈칸으로 두세요.',
      default: 'Noto Sans CJK KR, NanumGothic',
      type: 'text',
      onChange: (value: string) => {}
    }
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
