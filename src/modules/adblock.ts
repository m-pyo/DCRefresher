const blockScripts = (elem: HTMLScriptElement) => {
  if (
    (elem.src &&
      [
        'ads',
        'ad.min.js',
        'addc',
        'ad.about.co.kr',
        'cdn.taboola.com',
        'taboola',
        'netinsight'
      ].filter(v => elem.src.indexOf(v) > -1).length) ||
    (!elem.src && elem.innerHTML.indexOf('taboola') > -1)
  ) {
    elem.parentElement!.removeChild(elem)
  }
}

const blockLinks = (elem: HTMLLinkElement) => {
  if (
    elem.href &&
    ['ads', 'adservice'].filter(v => elem.href.indexOf(v) > -1).length
  ) {
    elem.parentElement!.removeChild(elem)
  }
}

const blockListAds = (elem: HTMLElement) => {
  if (elem.innerHTML === 'AD') {
    if (!elem.parentElement || !elem.parentElement.parentElement) {
      return
    }

    elem.parentElement.parentElement.style.display = 'none'
  }
}

export default {
  name: '광고 차단',
  description: '페이지 로드 속도를 느리게 만드는 광고를 차단합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: null,
    uuidf2: null,
    uuidf3: null,
    uuidf4: null,
    eventRefresh: null
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'eventBus'],
  func (filter: RefresherFilter, eventBus: RefresherEventBus) {
    if (document.body) {
      document.body.classList.add('refresherAdBlock')
    }

    this.memory.uuid = filter.add('script', blockScripts)
    this.memory.uuidf2 = filter.add('link', blockLinks)
    this.memory.uuidf3 = filter.addGlobal(
      'listAd',
      '.gall_list .gall_subject b',
      blockListAds
    )

    this.memory.uuidf4 = filter.add('body', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherAdBlock') == -1) {
        elem.className += ' refresherAdBlock'
      }
    })

    this.memory.eventRefresh = eventBus.on('refresh', () => {
      filter.runSpecific('listAd').catch((_: Error) => {})
    })
  },

  revoke (filter: RefresherFilter, eventBus: RefresherEventBus) {
    if (document.body) {
      document.body.classList.remove('refresherAdBlock')
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }

    if (this.memory.uuidf2) {
      filter.remove(this.memory.uuidf2, true)
    }

    if (this.memory.uuidf3) {
      filter.remove(this.memory.uuidf3, true)
    }

    if (this.memory.uuidf4) {
      filter.remove(this.memory.uuidf4, true)
    }

    if (this.memory.eventRefresh) {
      eventBus.remove('refresh', this.memory.eventRefresh, true)
    }
  }
}
