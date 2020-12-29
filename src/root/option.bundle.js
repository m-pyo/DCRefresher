const ImageLists = {
  icon: '/assets/icons/logo/Icon.png'
}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)
const stor = (window.chrome && window.chrome.storage) || storage

document.addEventListener('DOMContentLoaded', () => {
  let app = new Vue({
    el: '#refresher-app',
    data: () => {
      return {
        tab: 0,
        modules: [],
        settings: {},
        links: [
          {
            text: 'GitHub',
            url: 'https://github.com/So-chiru/DCRefresher'
          },
          {
            text: '개발자 후원',
            url: 'https://github.com/So-chiru/So-chiru/blob/master/DONATION.md'
          },
          {
            text: '리뷰 남기기',
            url: /Chrome/.test(navigator.userAgent)
              ? 'https://chrome.google.com/webstore/detail/dc-refresher/gpipaoeekcphlmilndfdbfdgijjjiklh'
              : 'https://addons.mozilla.org/en-US/firefox/addon/dc-refresher/'
          }
        ]
      }
    },

    methods: {
      open (url) {
        window.open(url, '_blank')
      },

      advancedSettingsCount (obj) {
        return Object.keys(obj).filter(v => obj[v] && obj[v].advanced).length
      },

      updateUserSetting (module, key, value) {
        chrome.tabs.query({ active: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {
            updateUserSetting: true,
            name: module,
            key,
            value
          })
        })
      }
    }
  })

  document.querySelectorAll('img[data-image]').forEach(v => {
    v.src = chrome.extension.getURL(ImageLists[v.dataset.image])
  })

  runtime.sendMessage(
    {
      requestRefresherModules: true
    },
    null,
    res => {
      app.$data.modules = res || {}
    }
  )

  runtime.sendMessage(
    {
      requestRefresherSettings: true
    },
    null,
    res => {
      app.$data.settings = res || {}
    }
  )
})

Vue.component('refresher-module', {
  template: `<div class="refresher-module">
    <div class="left">
      <p class="title">{{name}}</p>
      <p class="desc">{{desc}}</p>
      <p class="mute">개발자 : <span class="link" v-if="typeof author === 'object'" v-on:click="() => openLink(author && author.url)">{{author.name}}</span><span v-else>{{author || '알 수 없음'}}</span>, 요구 유틸 : {{require.join(', ') || '없음'}}</p>
    </div>
    <div class="right">
      <refresher-checkbox :checked="enabled" :change="update"></refresher-checkbox>
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
    },

    author: {
      type: [String, Object],
      required: false
    },

    require: {
      type: Array,
      required: false
    },

    enabled: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    update (_module, _key, value) {
      let obj = {}
      obj[`${this.name}.enable`] = value
      stor.sync.set(obj)

      if (this.name === '광고 차단') {
        runtime.sendMessage({
          toggleAdBlock: value
        })
      }

      chrome.tabs.query({ active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          updateModuleSettings: true,
          name: this.name,
          value: value
        })
      })
    },

    openLink (url) {
      if (!url) {
        return
      }

      window.open(url, '_blank')
    }
  }
})

Vue.component('refresher-checkbox', {
  template: `<div class="refresher-checkbox" :data-id="id" :data-module="modname" :class="{disabled: disabled}" :data-on="on" v-on:click="toggle">
    <div class="selected" :style="{transform: 'translateX(' + (typeof translateX !== 'undefined' ? translateX : (this.on ? 18 : 0)) + 'px)'}" v-on:pointermove="hover" v-on:pointerdown="down" v-on:pointerup="up" v-on:pointerout="out">
    </div>
  </div>`,

  props: {
    change: {
      type: Function
    },

    modname: {
      type: String,
      required: false
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

      this.change &&
        this.change(this.$el.dataset.module, this.$el.dataset.id, this.on)
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

Vue.component('refresher-options', {
  template: `<div class="refresher-options" :data-id="id" :data-on="on" v-on:click="toggle">
    <select :disabled="disabled">
      <option v-for="(name, index) in options" value="index">{{name}}</option>
    </select>
  </div>`,

  props: {
    options: {
      type: Array
    },

    id: {
      type: String
    },

    disabled: {
      type: Boolean
    }
  }
})

Vue.component('refresher-input', {
  template: `<div class="refresher-input">
    <input type="text" :data-id="id" :data-module="modname" :placeholder="placeholder" :value="value" :disabled="disabled" v-on:change="update"></input>
  </div>`,

  props: {
    change: {
      type: Function
    },

    placeholder: {
      type: String,
      required: false
    },

    modname: {
      type: String
    },

    id: {
      type: String
    },

    value: {
      type: String
    },

    disabled: {
      type: Boolean
    }
  },

  methods: {
    update (ev) {
      if (this.change) {
        this.change(
          ev.target.dataset.module,
          ev.target.dataset.id,
          ev.target.value
        )
      }
    }
  }
})

Vue.component('refresher-range', {
  template: `<div class="refresher-range">
    <input type="range" :data-id="id" :data-module="modname" :placeholder="placeholder" :value="value" :disabled="disabled" v-on:input="input" v-on:change="update" :max="max" :min="min" :step="step"></input>
    <span class="indicator">{{value + (this.unit ? this.unit : '')}}</span>
  </div>`,

  props: {
    change: {
      type: Function
    },

    placeholder: {
      type: Number,
      required: false
    },

    modname: {
      type: String
    },

    id: {
      type: String
    },

    value: {
      type: Number
    },

    max: {
      type: Number
    },

    min: {
      type: Number
    },

    step: {
      type: Number
    },

    unit: {
      type: String
    },

    disabled: {
      type: Boolean
    }
  },

  methods: {
    input (ev) {
      this.$el.querySelector('.indicator').innerHTML =
        ev.target.value + (this.unit ? this.unit : '')
    },

    update (ev) {
      if (this.change) {
        this.change(
          ev.target.dataset.module,
          ev.target.dataset.id,
          ev.target.value
        )
      }
    }
  },

  mounted () {
    this.$data.__temp = this.value
  }
})
