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

import { Outer, Scroll } from '../components/frame'

class InternalFrame implements RefresherFrame {
  title: string
  subtitle: string
  comments: object
  functions: { [index: string]: Function }

  class: string
  options: FrameOption
  app: Vue
  data: { [index: string]: any }

  contents: string
  error: object | boolean
  upvotes: any
  downvotes: any
  buttonError: any

  constructor (cls: string, options: FrameOption, app: Vue) {
    this.class = cls
    this.options = options

    this.title = ''
    this.subtitle = ''
    this.comments = {}
    this.functions = {}

    this.app = app
    this.data = {}

    this.error = false
    this.contents = ''
    this.upvotes = null
    this.downvotes = null
    this.buttonError = null
  }

  querySelector (a: string) {
    return this.app.$el.querySelector(a)
  }

  querySelectorAll (a: string) {
    return this.app.$el.querySelectorAll(a)
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
        Outer,
        Scroll
      },
      el: this.outer,
      data: () => {
        return {
          frames: [],
          ...option,
          activeGroup: option.groupOnce,
          fade: false,
          stampMode: false,
          scrollModeTop: false,
          scrollModeBottom: false
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

    let keyupFunction = (ev: KeyboardEvent) => {
      if (ev.code === 'Escape') {
        this.app.outerClick()
      }

      document.removeEventListener('keyup', keyupFunction)
    }
    document.addEventListener('keyup', keyupFunction)

    document.querySelector('body')!.style.overflow = 'hidden'

    if (option && option.onScroll) {
      let refresherGroup = this.app.$el.querySelector('.refresher-group')

      if (!refresherGroup) {
        return
      }

      refresherGroup.addEventListener('wheel', ev => {
        if (option.onScroll) {
          option.onScroll(ev, this.app, refresherGroup)
        }
      })
    }
  }
}
