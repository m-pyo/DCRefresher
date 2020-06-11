const Vue = require('vue')

require('./user')

Vue.component('refresher-comment', {
  template: `<div class="refresher-comment" :data-depth="comment.depth" :data-deleted="comment.del_yn === 'Y'">
    <div class="meta">
      <refresher-user :user="comment.user" :me="checkParticipant(comment.user.id)"></refresher-user>
      <div class="float-right">
        <refresher-timestamp :date="new Date(date(comment.reg_date))"></refresher-timestamp>
      </div>
    </div>
    <p class="refresher-comment-content" v-html="comment.memo"></p>
  </div>`,
  props: {
    comment: {
      type: Object,
      required: true
    },

    parentUser: {
      type: Object,
      required: false
    }
  },
  methods: {
    date (str) {
      return str.substring(0, 4).match(/\./)
        ? `${new Date().getFullYear()}.${str}`
        : str
    },

    extractID (str) {
      let match = str.match(/gallog\.dcinside.com\/.+\'/g)
      return match ? match[0].replace(/gallog\.dcinside.com\/|\'/g, '') : null
    },

    checkParticipant (id) {
      let same = false

      if (!id) {
        return false
      }

      let loginid = document.querySelector('#login_box .user_option a')
      if (loginid) {
        same = this.extractID(loginid.getAttribute('onclick') || '') === id
      }

      let post = document.querySelector('.gallview_head .gall_writer')
      if (!same && post && post.dataset) {
        same =
          post.dataset.uid &&
          post.dataset.uid.length > 0 &&
          post.dataset.uid === id
      }

      if (!same && this.parentUser) {
        same =
          this.parentUser.id &&
          this.parentUser.id.length > 0 &&
          this.parentUser.id === id
      }

      return same
    }
  }
})
