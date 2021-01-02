let observer

export default {
  name: '유저 정보',
  description: '유동, 반고닉 사용자의 IP, 아이디 정보를 표시합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: '',
    uuid2: '',
    always: ''
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'ip', 'eventBus'],
  func (filter: RefresherFilter, ip, eventBus: RefresherEventBus) {
    let ipInfoAdd = (elem: HTMLElement) => {
      if (!elem || !elem.dataset.ip || elem.dataset.refresherIp) return false
      let ip_data = ip.ISPData(elem.dataset.ip, '')

      // TODO : VPN 가르기

      let text = document.createElement('span')
      text.className = 'ip refresherIP'
      let format = ip.format(ip_data)
      text.innerHTML = `<span>${format}</span>`
      text.title = format

      let fl = elem.querySelector('.fl')
      if (fl) {
        let flIpQuery = fl.querySelector('.ip')

        if (flIpQuery) {
          fl.insertBefore(text, flIpQuery.nextSibling)
        }
      } else {
        elem.appendChild(text)
      }

      elem.dataset.refresherIp = ip_data && ip_data.name && format
    }

    let IdInfoAdd = (elem: HTMLElement) => {
      if (!elem || !elem.dataset.uid || elem.dataset.refresherId) return false

      let img = elem.querySelector('img')
      if (!img || img.src.indexOf('dc/w/images/nik.gif') === -1) {
        return false
      }

      let text = document.createElement('span')
      text.className = 'ip refresherIP'
      text.innerHTML = `<span>(${elem.dataset.uid})</span>`
      text.title = elem.dataset.uid

      let fl = elem.querySelector('.fl')
      if (fl) {
        let flIpQuery = fl.querySelector('.ip')

        if (flIpQuery) {
          fl.insertBefore(text, flIpQuery.nextSibling)
        }
      } else {
        elem.appendChild(text)
      }

      elem.dataset.refresherId = 'true'
    }

    const elemAdd = (elem: HTMLElement | Document) => {
      let list = elem.querySelectorAll('.ub-writer')
      let iter = list.length

      while (iter--) {
        ipInfoAdd(list[iter] as HTMLElement)
        IdInfoAdd(list[iter] as HTMLElement)
      }

      // TODO : 글목록 반고닉 사용자 ID 표시하기
    }

    this.memory.uuid = filter.add('.ub-writer', (elem: HTMLElement) => {
      ipInfoAdd(elem)
      IdInfoAdd(elem)
    })
    this.memory.uuid2 = eventBus.on('refresh', elemAdd)

    // observer = new MutationObserver(mutations => {
    //   mutations.forEach(mutation => {
    //     if (!mutation.addedNodes) {
    //       return
    //     }
    //     console.log(mutation)
    //   })
    // })

    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   childList: true,
    //   characterData: true
    // })

    // this.memory.always = filter.add(
    //   '.ub-writer',
    //   (elem: HTMLElement) => {
    //     console.log(elem)
    //     ipInfoAdd(elem)
    //   },
    //   {
    //     neverExpire: true
    //   }
    // )

    elemAdd(document)
  },
  revoke (filter: RefresherFilter, ip, eventBus: RefresherEventBus) {
    if (this.memory.uuid) {
      filter.remove(this.memory.uuid)
    }

    // if (this.memory.uuid2) {
    //   eventBus.remove('refresh', this.memory.uuid2)
    // }

    if (this.memory.always) {
      filter.remove(this.memory.always)
    }

    let lists = document.querySelectorAll('.refresherIP')

    lists.forEach(elem => {
      elem.parentElement?.removeChild(elem)
    })
  }
}