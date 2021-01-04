export default {
  name: '유저 정보',
  description: '유동, 반고닉 사용자의 IP, 아이디 정보를 표시합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    always: ''
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'ip'],
  func (filter: RefresherFilter, ip) {
    let ipInfoAdd = (elem: HTMLElement) => {
      if (!elem || !elem.dataset.ip || elem.dataset.refresherIp) return false
      let ip_data = ip.ISPData(elem.dataset.ip, '')

      // TODO : VPN 가르기

      let text = document.createElement('span')
      text.className = 'ip refresherIP'
      let format = ip.format(ip_data)
      text.innerHTML = `<span>${
        format.length > 100 ? format.substring(0, 97) + '...' : format
      }</span>`
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
    }

    this.memory.always = filter.add(
      '.ub-writer',
      (elem: HTMLElement) => {
        ipInfoAdd(elem)
        IdInfoAdd(elem)
      },
      {
        neverExpire: true
      }
    )
    filter.runSpecific(this.memory.always)

    elemAdd(document)
  },
  revoke (filter: RefresherFilter, ip) {
    if (this.memory.always) {
      filter.remove(this.memory.always, true)
    }

    let lists = document.querySelectorAll('.refresherIP')

    lists.forEach(elem => {
      elem.parentElement?.removeChild(elem)
    })
  }
}
