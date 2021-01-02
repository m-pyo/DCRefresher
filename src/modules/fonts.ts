export default {
  name: '폰트 교체',
  description: '페이지에 전반적으로 표시되는 폰트를 교체합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: {
    customFonts: 'Noto Sans CJK KR, NanumGothic'
  },
  memory: {
    uuid: null
  },
  settings: {
    customFonts: {
      name: 'font-family 이름',
      desc:
        '페이지 폰트를 입력된 폰트로 교체합니다. (빈칸으로 둘 시 확장 프로그램 기본 폰트로 설정)',
      default: 'Noto Sans CJK KR, NanumGothic',
      type: 'text'
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

    if (this.status.customFonts) {
      if (document && document.head) {
        let d = document.createElement('style')
        d.id = 'refresherFontStyle'
        d.innerHTML = `.refresherFont,.refresherFont .gall_list,.refresherFont button,.refresherFont input,.refresherFont .view_comment div,.refresherFont .view_content_wrap,.refresherFont .view_content_wrap a,.btn_cmt_close,.btn_cmt_close span,.btn_cmt_refresh,.btn_cmt_open{font-family:${this.status.customFonts},-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif!important}`
        document.head.appendChild(d)
      }
    }
  },

  revoke (filter: RefresherFilter) {
    if (document.body.className.indexOf('refresherFont') > -1) {
      document.body.classList.remove('refresherFont')
    }

    let fontElement = document.querySelector('#refresherFontStyle')
    if (fontElement) {
      fontElement.parentElement?.removeChild(fontElement)
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }
  }
}
