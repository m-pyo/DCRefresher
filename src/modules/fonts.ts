export default {
  name: '폰트 교체',
  description: '페이지에 전반적으로 표시되는 폰트를 교체합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: {
    customFonts: 'Noto Sans CJK KR, NanumGothic',
    changeDCFont: true
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
    },
    changeDCFont: {
      name: '디시인사이드 폰트 교체',
      desc:
        '미리보기 창 같은 DCRefresher의 폰트 뿐만 아니라 디시인사이드의 폰트까지 교체합니다. (페이지 리로드 필요)',
      type: 'check',
      default: true
    }
  },
  enable: true,
  default_enable: true,
  require: ['filter'],
  func (filter: RefresherFilter) {
    if (document && document.body) {
      document.body.classList.add('refresherFont')

      if (this.status.changeDCFont) {
        document.body.classList.add('refresherChangeDCFont')
      }
    }

    this.memory.uuid = filter.add('body', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherFont') == -1) {
        elem.className += ' refresherFont'
      }

      if (this.status.changeDCFont) {
        if (elem.className.indexOf('refresherChangeDCFont') == -1) {
          elem.className += ' refresherChangeDCFont'
        }
      }
    })

    if (this.status.customFonts) {
      if (document && document.head) {
        let d = document.createElement('style')
        d.id = 'refresherFontStyle'
        d.innerHTML = `.refresherFont .refresher-block-popup,.refresherFont .refresher-frame,.refresherFont .refresher-popup,.refresherChangeDCFont .gall_list,.refresherChangeDCFont button,.refresherChangeDCFont input,.refresherChangeDCFont .view_comment div,.refresherChangeDCFont .view_content_wrap,.refresherChangeDCFont .view_content_wrap a,.refresherChangeDCFont .btn_cmt_close,.refresherChangeDCFont .btn_cmt_close span,.refresherChangeDCFont .btn_cmt_refresh,.refresherChangeDCFont .btn_cmt_open{font-family:${this.status.customFonts},-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif!important}`
        document.head.appendChild(d)
      }
    }
  },

  revoke (filter: RefresherFilter) {
    if (document.body.className.indexOf('refresherFont') > -1) {
      document.body.classList.remove('refresherFont')
    }

    if (document.body.className.indexOf('refresherChangeDCFont') > -1) {
      document.body.classList.remove('refresherChangeDCFont')
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
