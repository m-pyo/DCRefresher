const ImageLists = {
  icon: '/assets/icons/logo/Icon.png'
}

document.addEventListener('DOMContentLoaded', () => {
  let app = new Vue({
    el: '#refresher-app',
    data: () => {
      return {
        tab: 0,
        modules: [
          {
            name: '다크 모드',
            desc: 'DC 페이지를 검게 만듭니다.'
          }
        ],
        links: [
          {
            text: 'GitHub',
            url: 'https://github.com/So-chiru/DCRefresher'
          },
          {
            text: '개발자 후원',
            url: 'https://github.com/So-chiru/'
          },
          {
            text: '리뷰 남기기',
            url: window.chrome
              ? 'https://chrome.google.com/webstore/detail/dc-refresher/gpipaoeekcphlmilndfdbfdgijjjiklh'
              : 'https://addons.mozilla.org/en-US/firefox/addon/dc-refresher/'
          }
        ]
      }
    },

    methods: {
      open (url) {
        window.open(url, '_blank')
      }
    }
  })

  document.querySelectorAll('img[data-image]').forEach(v => {
    v.src = chrome.extension.getURL(ImageLists[v.dataset.image])
  })
})

Vue.component('refresher-module', {
  template: `<div class="refresher-module">
    <div class="">
      <p>{{name}}</p>
      <p>{{desc}}</p>
    </div>
    <div class="">
      <refresher-checkbox></refresher-checkbox>
    </div>
  </div>`,

  props: {
    name: {
      type: String,
      required: true
    },

    desc: {
      type: String,
      required: true
    }
  }
})

Vue.component('refresher-checkbox', {
  template: `<div class="refresher-checkbox" :class="{disabled: disabled}" :data-id="id" :data-on="on" v-on:click="toggle">
    <div class="selected" :style="{transform: 'translateX(' + (typeof translateX !== 'undefined' ? translateX : (this.on ? 18 : 0)) + 'px)'}" v-on:pointermove="hover" v-on:pointerdown="down" v-on:pointerup="up" v-on:pointerout="out">
    </div>
  </div>`,

  props: {
    onChange: {
      type: Function
    },

    id: {
      type: String
    },

    checked: {
      type: Boolean
    },

    disabled: {
      type: Boolean
    }
  },

  data () {
    return {
      on: this.checked,
      _down: false,
      translateX: undefined,
      onceOut: false
    }
  },

  methods: {
    toggle () {
      if (this.disabled) {
        return
      }

      if (this.onceOut) {
        this.onceOut = false

        return
      }

      this.on = !this.on

      this.onChange &&
        this.onChange({
          target: {
            dataset: { id: this.id },
            checked: this.on,
            type: 'checkbox'
          }
        })
    },

    hover (ev) {
      if (this.disabled) {
        return
      }

      if (this._down) {
        this.translateX = Math.ceil(ev.offsetX)
      }
    },

    down (ev) {
      if (this.disabled) {
        return
      }

      this._down = true
    },

    up (ev) {
      if (this.disabled) {
        return
      }

      this._down = false
      this.translateX = undefined
    },
    out () {
      if (this.disabled) {
        return
      }

      if (this._down) {
        this._down = false
        this.translateX = undefined
        this.toggle()

        this.onceOut = true
      }
    }
  }
})

