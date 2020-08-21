export default {
  template: `<div class="refresher-user" :data-me="me">
    <span class="refresher-user-icon" :data-icon="user.icon" :data-type="user.type"></span>
    <span class="refresher-user-nick">{{user.nick}}</span>
    <span class="refresher-user-info">{{user.id ? '(' + user.id + ')' : user.ip ? '(' + user.ip + (user.ip_data ? ', ' + user.ip_data : '') + ')' : ''}}</span>
  </div>`,
  props: {
    user: {
      type: Object,
      required: true
    },

    me: {
      type: Boolean,
      required: false
    }
  }
}
