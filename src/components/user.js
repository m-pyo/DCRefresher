const Vue = require('vue')

Vue.component('refresher-user', {
  template: `<div class="refresher-user">
    <span class="refresher-user-icon" :data-icon="user.icon" :data-type="user.type"></span>
    <span class="refresher-user-nick">{{user.nick}}</span>
    <span class="refresher-user-info">{{user.id ? '(' + user.id + ')' : user.ip ? '(' + user.ip + ')' : ''}}</span>
  </div>`,
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.user)
  }
})
