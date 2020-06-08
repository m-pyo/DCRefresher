const Vue = require('vue')

require('./user')

Vue.component('refresher-comment', {
  template: `<div class="refresher-comment" :data-depth="comment.depth">
    <refresher-user :user="comment.user"></refresher-user>
    <p class="refresher-comment-content" v-html="comment.memo"></p>
  </div>`,
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
})
