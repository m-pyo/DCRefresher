export default {
  template: `
  <transition name="refresher-shake">
    <div class="refresher-preview-button" :key="error" v-on:click="safeClick">
      <img :src="getURL('/assets/icons/' + id + '.png')"></img>
      <p class="refresher-vote-text" :id="'refresher-' + id + '-counts'">{{text}}</p>
    </div>
  </transition>`,
  props: {
    id: { type: [String, Number] },
    text: {
      type: String
    },
    click: {
      type: Function,
      required: false
    }
  },
  data () {
    return {
      error: null
    }
  },
  methods: {
    getURL (u) {
      return !chrome || !chrome.extension ? u : chrome.extension.getURL(u)
    },

    async safeClick () {
      let result = this.click && (await this.click())

      if (!result) {
        this.error = Math.random()
      }

      return result
    }
  }
}
