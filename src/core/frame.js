;(() => {
  /**
   *
   * @param {Object} option
   * @param {*} className 적용할 className (default)
   */

  class frame {
    constructor (option, className) {
      if (!document || !document.createElement) {
        throw new Error(
          "Frame can't be made before DOMContentLoaded event. (DOM isn't accessible)"
        )
      }

      if (typeof option === 'undefined') {
        option = {}
      }

      this.x = option.x
      this.y = option.y
      this.center = option.center
      this.background = option.background

      this.class = className || 'default'

      this.make()
      this.appendToBody()
    }

    make () {
      this.outer = document.createElement('refresher-frame-outer')
      this.frame = document.createElement('refresher-frame')
      this.frame.className = this.class

      if (this.x !== null) {
        this.frame.style.left = this.x
      }

      if (this.y !== null) {
        this.frame.style.top = this.y
      }

      if (this.center) {
        this.outer.classList.add('center')
        this.frame.classList.add('center')
      }

      if (this.background) {
        this.outer.classList.add('background')
      }

      this.outer.addEventListener('click', ev => {
        if (ev.target !== this.outer) return ev
        this.outerClick(ev)
      })

      this.outer.appendChild(this.frame)
    }

    fadeIn () {
      if (this.outer.className.indexOf(/fadeOut/g) !== -1) {
        this.outer.classList.remove('fadeOut')
      }

      this.outer.classList.add('fadeIn')
    }

    fadeOut () {
      if (this.outer.className.indexOf(/fadeIn/g) !== -1) {
        this.outer.classList.remove('fadeIn')
      }

      this.outer.classList.add('fadeOut')
    }

    outerClick (ev) {
      console.log(ev)

      this.close()
    }

    close () {
      this.fadeOut()

      setTimeout(() => {
        this.outer.parentNode.removeChild(this.outer)
      }, 300)
    }

    appendToBody () {
      document.querySelector('body').appendChild(this.outer)
    }

    get innerHTML() {
      return this.outer.innerHTML
    }

    set innerHTML (html) {
      this.frame.innerHTML = html
    }

    querySelector(...a) {
      return this.frame.querySelector(...a)
    }
  }

  module.exports = frame
})()
