import * as Color from '../utils/color'
import * as DOM from '../utils/dom'

const contentColorFix = (el: HTMLElement) => {
  if (!el) return

  let qSelector = el.querySelector(
    '.refresher-frame:first-child .refresher-preview-contents'
  )! as HTMLElement

  DOM.traversal(qSelector).forEach(elem => {
    if (!elem.style || !(elem.style.color || elem.hasAttribute('color'))) return

    colorCorrection(elem)
  })
}

const colorCorrection = (elem: HTMLElement) => {
  let fontAttr = elem.hasAttribute('color')

  let textColor = Color.parse(
    fontAttr ? elem.getAttribute('color') : elem.style.color
  )

  let contrast = Color.contrast(textColor, [41, 41, 41])

  if (contrast < 3) {
    let trans = Color.RGBtoHSL(textColor[0], textColor[1], textColor[2])
    trans[2] = Color.inverseColor(trans[2])
    let rollback = Color.HSLtoRGB(trans[0], trans[1], trans[2])

    if (fontAttr) {
      elem.setAttribute(
        'color',
        Color.RGBtoHEX(rollback[0], rollback[1], rollback[2])
      )
    } else {
      elem.style.color = `rgb(${rollback[0]}, ${rollback[1]}, ${rollback[2]})`
    }
  }
}

export default {
  name: '다크 모드',
  description: '페이지와 DCRefresher의 창을 어두운 색상으로 변경합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  top: true,
  memory: {
    uuid: null,
    uuid2: null,
    contentViewUUID: null
  },
  enable: true,
  default_enable: false,
  require: ['filter', 'eventBus'],
  func (filter: RefresherFilter, eventBus: RefresherEventBus) {
    if (document && document.head) {
      let d = document.createElement('style')
      d.id = 'refresherDarkStyle'
      d.innerHTML = `body,.dcwrap,.left_content,.dcfoot,.issuebox,.inner_search {background-color: #222;}`
      document.head.appendChild(d)
    }

    if (
      document &&
      document.body &&
      document.body.className.indexOf('refresherDark') < 0
    ) {
      document.body.className += ' refresherDark'
    }

    this.memory.uuid = filter.add('body', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherDark') == -1) {
        elem.className += ' refresherDark'
      }
    })

    this.memory.uuid2 = filter.add(
      '.gallview_contents .inner .writing_view_box *',
      (elem: HTMLElement) => {
        if (!elem.style || !(elem.style.color || elem.hasAttribute('color')))
          return

        colorCorrection(elem)
      }
    )

    this.memory.contentViewUUID = eventBus.on('contentPreview', contentColorFix)
  },

  revoke (filter: RefresherFilter, eventBus: RefresherEventBus) {
    document.body.classList.remove('refresherDark')

    let style = document.querySelector('#refresherDarkStyle')
    if (style) {
      style.parentElement?.removeChild(style)
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }

    if (this.memory.uuid2) {
      filter.remove(this.memory.uuid2, true)
    }

    if (this.memory.contentViewUUID) {
      eventBus.remove('contentPreview', this.memory.contentViewUUID, true)
    }
  }
}
