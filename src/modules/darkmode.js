const Color = require('../utils/color')

;(() => {
  let MODULE = {
    name: '다크 모드',
    description:
      '디시인사이드 페이지와 DCRefresher의 창을 어두운 색상으로 변경합니다.',
    author: 'Sochiru',
    status: false,
    top: true,
    memory: {},
    enable: true,
    default_enable: false,
    require: ['filter', 'eventBus'],
    func (filter, eventBus) {
      if (document && document.head) {
        let d = document.createElement('style')
        d.innerHTML = `body,.dcwrap,.left_content,.dcfoot,.issuebox,.inner_search {background-color: #222;}`
        document.head.appendChild(d)
      }

      if (document && document.body) {
        document.body.className += ' refresherDark'
      }

      this.memory.uuid = filter.add('body', elem => {
        if (elem.className.indexOf('refresherDark') == -1) {
          elem.className += ' refresherDark'
        }
      })

      this.memory.uuid2 = filter.add(
        '.gallview_contents .inner .writing_view_box *',
        elem => {
          if (!elem.style || !elem.style.color) return

          if (elem.style && elem.style.color) {
            let textColor = Color.parse(elem.style.color)
            if (Color.contrast(textColor, [41, 41, 41]) < 4) {
              let trans = Color.RGBtoHSL(
                textColor[0],
                textColor[1],
                textColor[2]
              )
              trans[2] = 0.8
              let rollback = Color.HSLtoRGB(trans[0], trans[1], trans[2])
              elem.style.color = `rgb(${rollback[0]}, ${rollback[1]}, ${rollback[2]})`
            }
          }
        }
      )

      eventBus.on('contentPreview', el => {
        if (!el || !el.$el) return

        let qSelector = el.$el.querySelectorAll('*')

        qSelector.forEach(elem => {
          if (!elem.style || !elem.style.color) return

          if (elem.style && elem.style.color) {
            let textColor = Color.parse(elem.style.color)
            if (Color.contrast(textColor, [41, 41, 41]) < 4) {
              let trans = Color.RGBtoHSL(
                textColor[0],
                textColor[1],
                textColor[2]
              )
              trans[2] = 0.8
              let rollback = Color.HSLtoRGB(trans[0], trans[1], trans[2])
              elem.style.color = `rgb(${rollback[0]}, ${rollback[1]}, ${rollback[2]})`
            }
          }
        })
      })
    }
  }

  module.exports = MODULE
})()
