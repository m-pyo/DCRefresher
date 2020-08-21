const Vue = require('vue')

require('./button')
require('./timestamp')

const Loader = Vue.component('refresher-loader', {
  template: `<transition name="refresher-opacity">
  <div class="refresher-loader"></div>
  </transition>`
}) 

const Frame = Vue.component('refresher-frame', {
  template: `<div class="refresher-frame" :class="{relative: frame.options.relative, blur: frame.options.blur, preview: frame.options.preview, center: frame.options.center}">
      <div class="refresher-preview-info">
        <div class="refresher-preview-title-zone">
          <transition name="refresher-slide-left" appear @before-enter="beforeEnter" @after-enter="afterEnter">
            <div class="refresher-preview-title" v-html="frame.title" :data-index="index + 1" :key="frame.title"></div>
          </transition>
          <transition name="refresher-slide-left" appear @before-enter="beforeEnter" @after-enter="afterEnter">
            <span class="refresher-preview-title-mute" v-html="frame.subtitle"></span>
          </transition>
        </div>
        <div class="refresher-preview-meta">
          <refresher-user v-if="frame.user" :user="frame.user"></refresher-user>
          <div class="float-right">
            <refresher-timestamp v-if="frame.date" :date="frame.date"></refresher-timestamp>
          </div>
        </div>
      </div>
      <div class="refresher-preview-contents">
        <refresher-loader v-show="frame.data.load"></refresher-loader>
        <transition name="refresher-opacity">
          <div v-html="frame.contents" :key="frame.contents"></div>
        </transition>

        <div class="refresher-preview-comments" v-if="frame.isComment">
          <transition-group name="refresher-slide-up" appear @before-enter="beforeEnter" @after-enter="afterEnter">
            <refresher-comment v-for="(comment, i) in frame.comments.comments" :data-index="i + 1" :parentUser="frame.user" :comment="comment" :key="'cmt_' + comment.no"></refresher-comment>
          </transition-group>
        </div>
      </div>
      <div class="refresher-preview-votes" v-if="frame.buttons">
        <div>
          <refresher-preview-button class="refresher-upvote" :icon="'upvote'" :id="'upvote'" :text="frame.upvotes || '0'" :click="upvote">
          </refresher-preview-button>
          <refresher-preview-button class="refresher-downvote" :icon="'downvote'" :id="'downvote'" :text="frame.downvotes || '0'" :click="downvote">
          </refresher-preview-button>
          <refresher-preview-button class="refresher-share primary" :icon="'share'" :id="'share'" :text="'공유'" :click="share">
          </refresher-preview-button>
        </div>
      </div>
    </div>`,
  props: ['frame', 'index'],
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 45 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    upvote () {
      return this.frame.voteFunction(1)
    },

    downvote () {
      return this.frame.voteFunction(0)
    },

    share() {
      return this.frame.shareFunction()
    },

    makeVoteRequest () {}
  }
})

const Outer = Vue.component('refresher-frame-outer', {
  template: `<div class="refresher-frame-outer" :class="{background: this.$root.background, fadeIn: this.$root.fade, fadeOut: !this.$root.fade, stack: this.$root.fade}" >
    <refresher-group></refresher-group>
  </div>`
})

const Group = Vue.component('refresher-group', {
  template: `<div class="refresher-group" v-on:click="clickHandle">
      <refresher-frame v-for="(frame, i) in frames" :key="'frame' + Math.random()" :frame="frame" :index="i"></refresher-frame>
    </div>`,
  data () {
    return {
      frames: this.$root.frames
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
  Frame,
  Group
}
