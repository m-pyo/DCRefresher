export default {
  template: `
    <div class="refresher-preview-button" v-on:click="safeClick">
      <transition name="refresher-shake">
        <img :key="error + 1" :src="getURL('/assets/icons/' + id + '.png')"></img>
      </transition>
      <transition name="refresher-shake">
        <p class="refresher-vote-text" :key="error" :id="'refresher-' + id + '-counts'">{{text}}</p>
      </transition>
    </div>
  `,
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
