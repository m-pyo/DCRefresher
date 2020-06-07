const Vue = require('vue')

const Loader = Vue.component('refresher-loader', {
  template: `<div class="refresher-loader"></div>`
})

const PreviewButton = Vue.component('refresher-preview-button', {
  template: `<div class="refresher-preview-button">
    <img :src="getURL('/assets/icons/' + id + '.png')"></img>
    <p class="refresher-vote-text" :id="'refresher-' + id + '-counts'">{{text}}</p>
  </div>`,
  props: {
    icon: {
      type: String,
      required: true
    },
    id: { type: [String, Number] },
    text: {
      type: String
    }
  },
  methods: {
    getURL (u) {
      return chrome.extension.getURL(u)
    }
  }
})

const Frame = Vue.component('refresher-frame', {
  template: `<div class="refresher-frame" :class="{relative: frame.options.relative, preview: frame.options.preview, center: frame.options.center}">
      <div class="refresher-preview-info">
        <div class="refresher-preview-title">
          {{frame.title}}
        </div>
        <div class="refresher-preview-meta"></div>
      </div>
      <div class="refresher-preview-contents">
        <refresher-loader v-if="frame.load"></refresher-loader>
        {{frame.contents}}
      </div>
      <div class="refresher-preview-votes" v-if="frame.buttons">
        <div>
          <refresher-preview-button class="refresher-upvote" :icon="'upvote'" :id="'upvote'" :text="frame.upvotes || '0'">
          </refresher-preview-button>
          <refresher-preview-button class="refresher-downvote" :icon="'downvote'" :id="'downvote'" :text="frame.downvotes || '0'">
          </refresher-preview-button>
          <refresher-preview-button class="refresher-share" :icon="'share'" :id="'share'" :text="'공유'">
          </refresher-preview-button>
        </div>
      </div>
    </div>`,
  props: {
    frame: {
      type: Object,
      required: true
    }
  }
})

const Outer = Vue.component('refresher-frame-outer', {
  template: `<div class="refresher-frame-outer" :class="{background: this.$root.background, fadeIn: this.$root.fade, fadeOut: !this.$root.fade, stack: this.$root.fade}" >
    <refresher-group></refresher-group>
  </div>`
})

const Group = Vue.component('refresher-group', {
  template: `<div class="refresher-group" v-on:click="clickHandle">
      <refresher-frame v-if="frames" v-for="(frame, i) in frames" :key="'frame' + i" :frame="frame"></refresher-frame>
    </div>`,
  computed: {
    frames () {
      return this.$root.frames
    }
  },
  methods: {
    clickHandle (ev) {
      if (ev.target !== this.$el) return ev
      this.$root.outerClick(ev)
    }
  }
})

module.exports = {
  Loader,
  PreviewButton,
  Frame,
  Group
}
