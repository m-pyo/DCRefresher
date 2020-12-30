export default {
  name: 'IP 정보',
  description: '유동 사용자의 IP 정보를 표시합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  memory: {
    uuid: ''
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'ip', 'eventBus'],
  func (filter, ip, eventBus) {
    let ipInfoAdd = elem => {
      if (!elem || !elem.dataset.ip || elem.dataset.refresherIp) return false
      let ip_data = ip.ISPData(elem.dataset.ip, '')

      // TODO : VPN 가르기

      let text = document.createElement('span')
      text.className = 'ip refresherIP'
      let format = ip.format(ip_data)
      text.innerHTML = format
      text.title = format

      let fl = elem.querySelector('.fl')
      if (fl) {
        fl.insertBefore(text, fl.querySelector('.ip').nextSibling)
      } else {
        elem.appendChild(text)
      }

      elem.dataset.refresherIp = ip_data && ip_data.name && format
    }

    this.memory.uuid = filter.add('.ub-writer', (elem: HTMLElement) => {
      ipInfoAdd(elem)
    })

    eventBus.on('refresh', (elem: HTMLElement) => {
      let list = elem.querySelectorAll('.ub-writer')
      let iter = list.length

      while (iter--) {
        ipInfoAdd(list[iter])
      }
    })
  }
}
