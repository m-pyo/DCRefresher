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
        settings: [],
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
      <refresher-checkbox :checked="enabled" :onChange="update"></refresher-checkbox>
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
    update (v) {
      console.log(v)

      let obj = {}
      obj[`${this.name}.enable`] = v.target.checked
      stor.sync.set(obj)

      if (this.name === '광고 차단') {
        runtime.sendMessage({
          toggleAdBlock: true,
          data: v.target.checked
        })
      }

      chrome.tabs.query({ active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          updateModuleSettings: true,
          name: this.name,
          value: v.target.checked
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

Vue.component('refresher-options', {
  template: `<div class="refresher-options" :data-id="id" :data-on="on" v-on:click="toggle">
    <select :disabled="disabled">
      <option v-for="(name, index) in options" value="index">{{name}}</option>
    </select>
  </div>`,

  props: {
    onChange: {
      type: Function
    },

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
    <input type="text" :data-id="id" :data-module="modname" :placeholder="placeholder" :disabled="disabled" v-on:change="update"></input>
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
