const updateWindowSize = (
  forceActive: boolean,
  active: Number,
  width: Number
) => {
  if (typeof active === 'string') {
    active = Number(active)
  }

  if (forceActive || active >= width) {
    if (document.documentElement.className.indexOf('refresherCompact') === -1) {
      console.log(document.documentElement.classList)
      document.documentElement.classList.add('refresherCompact')
    }
  } else {
    if (document.documentElement.className.indexOf('refresherCompact') > -1) {
      document.documentElement.classList.remove('refresherCompact')
    }
  }
}

export default {
  name: '레이아웃 수정',
  description: '디시 레이아웃을 변경할 수 있도록 도와줍니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  url: /board\/lists/g,
  status: {
    activePixel: 900,
    forceCompact: false,
    hideGalleryView: false,
    hideUselessView: false,
    pushToRight: false
  },
  memory: {
    resize: () => {}
  },
  settings: {
    activePixel: {
      name: '컴팩트 모드 활성화 조건',
      desc: '브라우저 가로가 이 값 보다 작을 경우 컴팩트 모드를 활성화합니다.',
      type: 'range',
      default: 900,
      min: 100,
      step: 1,
      max: window.screen.width,
      unit: 'px',
      advanced: false
    },

    forceCompact: {
      name: '컴팩트 모드 강제 사용',
      desc: '항상 컴팩트 모드를 사용하도록 설정합니다.',
      type: 'check',
      default: false,
      advanced: false
    },

    hideGalleryView: {
      name: '갤러리 뷰 숨기기',
      desc: '갤러리 정보, 최근 방문 갤러리 영역을 숨깁니다.',
      type: 'check',
      default: false
    },

    hideUselessView: {
      name: '잡다 링크 숨기기',
      desc:
        '이슈줌, 타갤 개념글, 뉴스, 힛갤등의 컨텐츠를 오른쪽 영역에서 숨깁니다.',
      type: 'check',
      default: false
    },

    pushToRight: {
      name: '본문 영역 전체로 확장',
      desc: '"잡다 링크 숨기기" 옵션이 켜진 경우 본문 영역을 확장합니다.',
      type: 'check',
      default: false
    }
  },
  enable: true,
  default_enable: true,
  require: [],
  update: {
    activePixel (value: Number) {
      updateWindowSize(this.status.forceCompact, value, window.innerWidth)
    },

    forceCompact (value: boolean) {
      updateWindowSize(value, this.status.activePixel, window.innerWidth)
    },

    hideGalleryView (value: boolean) {
      document.documentElement.classList[value ? 'add' : 'remove'](
        'refresherHideGalleryView'
      )
    },

    hideUselessView (value: boolean) {
      document.documentElement.classList[value ? 'add' : 'remove'](
        'refresherHideUselessView'
      )
    },

    pushToRight (value: boolean) {
      document.documentElement.classList[value ? 'add' : 'remove'](
        'refresherPushToRight'
      )
    }
  },
  func () {
    this.memory.resize = () =>
      updateWindowSize(
        this.status.forceCompact,
        this.status.activePixel,
        window.innerWidth
      )
    window.addEventListener('resize', this.memory.resize)
    this.memory.resize()

    this.update.hideGalleryView(this.status.hideGalleryView)
    this.update.hideUselessView(this.status.hideUselessView)
    this.update.pushToRight(this.status.pushToRight)
  },

  revoke () {
    window.removeEventListener('resize', this.memory.resize)

    this.update.hideGalleryView(false)
    this.update.hideUselessView(false)
    this.update.pushToRight(false)
  }
}
