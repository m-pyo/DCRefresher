const Vue = require('vue')

Vue.component('refresher-preview-button', {
  template: `
  <transition name="refresher-shake">
    <div class="refresher-preview-button" :key="error" v-on:click="safeClick">
      <img :src="getURL('/assets/icons/' + id + '.png')"></img>
      <transition name="refresher-slide-left">
        <p class="refresher-vote-text" :key="text" :id="'refresher-' + id + '-counts'">{{text}}</p>
      </transition>
    </div>
  </transition>`,
  props: {
    icon: {
      type: String,
      required: true
    },
    id: { type: [String, Number] },
    text: {
      type: String
    },
    click: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      error: null
    }
  },
  methods: {
    getURL (u) {
      return chrome.extension.getURL(u)
    },

    async safeClick () {
      let result = this.click && await this.click()

      if (!result) {
        this.error = Math.random()
      }

      return result
    }
  }
})
