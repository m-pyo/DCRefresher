;(() => {
  let MODULE = {
    name: 'IP 정보',
    description: '유동 사용자의 IP 정보를 표시합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    require: ['filter', 'ip', 'eventBus'],
    func (filter, ip, eventBus) {
      let ipInfoAdd = elem => {
        if (!elem || !elem.dataset.ip || elem.dataset.refresherIp) return false
        let ip_str = ip.ISPString(elem.dataset.ip)

        let text = document.createElement('span')
        text.className = 'ip refresherIP'
        text.innerHTML = ip_str

        let fl = elem.querySelector('.fl')
        if (fl) {
          fl.insertBefore(text, fl.querySelector('.ip').nextSibling)
        } else {
          elem.appendChild(text)
        }

        elem.dataset.refresherIp = ip_str
      }

      this.memory.uuid = filter.add('.ub-writer', elem => {
        ipInfoAdd(elem)
      })

      eventBus.on('refresh', elem => {
        let list = elem.querySelectorAll('.ub-writer')
        let iter = list.length

        while (iter--) {
          ipInfoAdd(list[iter])
        }
      })
    }
  }

  module.exports = MODULE
})()
