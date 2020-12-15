import Vue from 'vue'

interface FrameOption {
  relative?: boolean
  center?: boolean
  preview?: boolean
  blur?: boolean
}

interface FrameStackOption {
  background?: boolean
  stack?: boolean
  groupOnce?: boolean
  onScroll?: Function
}

import { Outer } from '../components/frame'

class InternalFrame {
  class: string
  options: FrameOption
  app: Vue
  data: object

  contents: string
  error: object | boolean
  isComment: boolean
  comments: any
  upvotes: any
  downvotes: any
  buttonError: any

  constructor (cls: string, options: FrameOption, app: Vue) {
    this.class = cls
    this.options = options

    this.app = app
    this.data = {}

    this.error = false
    this.contents = ''
    this.isComment = false
    this.comments = null
    this.upvotes = null
    this.downvotes = null
    this.buttonError = null
  }

  setData (key: string, value: any) {
    this.data[key] = value
  }

  querySelector (...a: string[]) {
    return this.app.$el.querySelector(...a)
  }

  querySelectorAll (...a: string[]) {
    return this.app.$el.querySelectorAll(...a)
  }

  get center () {
    return this.options.center
  }
}

export default class {
  outer: HTMLElement
  frame: any[]
  app: Vue

  constructor (childs: Array<FrameOption>, option: FrameStackOption) {
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
    document.querySelector('body')!.appendChild(this.outer)

    this.frame = []
    this.app = new Vue({
      components: {
        Outer
      },
      el: this.outer,
      data: () => {
        return {
          frames: [],
          ...option,
          activeGroup: option.groupOnce,
          fade: false,
          stampMode: false
        }
      },
      methods: {
        changeStamp () {
          this.stampMode = !this.stampMode
        },

        first () {
          return this.frames[0]
        },

        second () {
          return this.frames[1]
        },

        outerClick () {
          this.$emit('close')
          this.fadeOut()
          document.querySelector('body')!.style.overflow = 'auto'

          setTimeout(() => {
            document.querySelector('body')!.removeChild(this.$el)
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

    document.querySelector('body')!.style.overflow = 'hidden'

    if (typeof option.onScroll === 'function') {
      let refresherGroup = this.app.$el.querySelector('.refresher-group')
      refresherGroup.addEventListener('wheel', ev => {
        option.onScroll(ev, this.app, refresherGroup)
      })
    }
  }
}
