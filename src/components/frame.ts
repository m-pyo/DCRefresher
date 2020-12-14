import Vue from 'vue'

import TimeStamp from './timestamp'
import CountDown from './countdown'
import PreviewButton from './button'
import User from './user'
import Comment from './comment'
import Icon from './icon'

export const Loader = Vue.component('refresher-loader', {
  template: `<transition name="refresher-opacity">
    <div class="refresher-loader spinner gray animating">
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
      <div class="spinner-blade"></div>
    </div>
  </transition>`
})

export const Frame = Vue.component('refresher-frame', {
  components: {
    PreviewButton,
    TimeStamp,
    CountDown,
    User,
    Comment,
    Icon
  },
  template: `<div class="refresher-frame" :class="{relative: frame.options.relative, blur: frame.options.blur, preview: frame.options.preview, center: frame.options.center}">
      <div class="refresher-preview-info">
        <div class="refresher-preview-title-zone">
          <transition name="refresher-slide-up" appear @before-enter="beforeEnter" @after-enter="afterEnter">
            <div class="refresher-preview-title" v-html="frame.title" :data-index="index + 1" :key="frame.title"></div>
          </transition>
          <transition name="refresher-slide-up" appear @before-enter="beforeEnter" @after-enter="afterEnter">
            <span class="refresher-preview-title-mute" v-html="frame.subtitle"></span>
          </transition>
        </div>
        <div class="refresher-preview-meta">
          <User v-if="frame.user" :user="frame.user"></User>
          <div class="float-right">
            <TimeStamp v-if="frame.date" :date="frame.date"></TimeStamp>
            <CountDown v-if="frame.expire" :date="frame.expire"></CountDown>
          </div>
        </div>
      </div>
      <div class="refresher-preview-contents">
        <refresher-loader v-show="frame.data.load"></refresher-loader>
        <transition name="refresher-opacity">
          <div v-html="frame.contents" :key="frame.contents"></div>
        </transition>

        <div class="refresher-preview-comments" v-if="frame.isComment && frame.comments.comments">
          <transition-group name="refresher-slide-up" appear @before-enter="beforeEnter" @after-enter="afterEnter">
            <Comment v-for="(comment, i) in frame.comments.comments" :data-index="i + 1" :parentUser="frame.user" :comment="comment" :key="'cmt_' + comment.no"></Comment>
          </transition-group>
        </div>
        <div v-if="frame.isComment && !frame.comments.comments">
          <h3 class="refresher-nocomment">작성된 댓글이 없습니다.</h3>
          <PreviewButton class="refresher-writecomment primary" :icon="'write'" id="write" text="댓글 달기" :click="writeComment"></PreviewButton>
        </div>
      </div>
      <div class="refresher-preview-votes" v-if="frame.buttons">
        <div>
          <PreviewButton class="refresher-upvote" :icon="'upvote'" :id="'upvote'" :text="frame.upvotes || '0'" :click="upvote">
          </PreviewButton>
          <PreviewButton class="refresher-downvote" :icon="'downvote'" :id="'downvote'" :text="frame.downvotes || '0'" :click="downvote">
          </PreviewButton>
          <PreviewButton class="refresher-share primary" :icon="'share'" :id="'share'" :text="'공유'" :click="share">
          </PreviewButton>
        </div>
      </div>
    </div>`,
  props: ['frame', 'index'],
  methods: {
    beforeEnter (el: HTMLElement) {
      el.style.transitionDelay = 45 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el: HTMLElement) {
      el.style.transitionDelay = ''
    },

    upvote () {
      return this.frame.voteFunction(1)
    },

    downvote () {
      return this.frame.voteFunction(0)
    },

    share () {
      return this.frame.shareFunction()
    },

    writeComment () {},

    makeVoteRequest () {}
  }
})

export const Outer = Vue.component('refresher-frame-outer', {
  template: `<div class="refresher-frame-outer" :class="{background: this.$root.background, fadeIn: this.$root.fade, fadeOut: !this.$root.fade, stack: this.$root.fade}" >
    <refresher-group></refresher-group>
  </div>`
})

export const Group = Vue.component('refresher-group', {
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
