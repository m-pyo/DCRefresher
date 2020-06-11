const Vue = require('vue')

require('../components/frame')
require('../components/comment')
;(() => {
  class InternalFrame {
    constructor (cls, options, app) {
      this.class = cls
      this.options = options

      this.app = app
      this.data = {}

      this.contents = ''
      this.isComment = false
      this.comments = null
      this.upvotes = null
      this.downvotes = null
      this.buttonError = null
    }

    setData (key, value) {
      this.data[key] = value
    }

    querySelector (...a) {
      return this.app.$el.querySelector(...a)
    }

    querySelectorAll (...a) {
      return this.app.$el.querySelectorAll(...a)
    }

    get center () {
      return this.options.center
    }
  }

  class frame {
    constructor (childs, option) {
      if (!document || !document.createElement) {
        throw new Error(
          "Frame is not available before DOMContentLoaded event. (DOM isn't accessible)"
        )
      }

      if (!childs) {
        childs = []
      }

      if (typeof option === 'undefined') {
        option = {}
      }

      this.outer = document.createElement('refresher-frame-outer')
      document.querySelector('body').appendChild(this.outer)

      this.frame = []
      this.app = new Vue({
        el: this.outer,
        data: () => {
          return {
            frames: [],
            ...option,
            activeGroup: option.groupOnce,
            fade: false
          }
        },
        methods: {
          first () {
            return this.frames[0]
          },

          second () {
            return this.frames[1]
          },

          outerClick () {
            this.fadeOut()
            document.querySelector('body').style.overflow = 'scroll'

            setTimeout(() => {
              document.querySelector('body').removeChild(this.$el)
            }, 300)
          },

          fadeIn () {
            this.fade = true
          },

          fadeOut () {
            this.fade = false
          }
        }
      })

      for (let i = 0; i < childs.length; i++) {
        this.app.frames.push(new InternalFrame(this.class, childs[i], this.app))
      }

      let keyupFunction = ev => {
        if (ev.keyCode === 27) {
          this.app.outerClick()
        }

        document.removeEventListener('keyup', keyupFunction)
      }
      document.addEventListener('keyup', keyupFunction)

      document.querySelector('body').style.overflow = 'hidden'
    }
  }

  module.exports = frame
})()
