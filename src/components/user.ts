import { eventBus } from '../core/eventbus'

export default {
  template: `<div class="refresher-user" :data-me="me" v-on:click="clickHandle" :class="{cursor: !!this.user.id}" v-on:contextmenu="contextMenu">
    <span class="refresher-user-icon" :data-icon="user.icon" :data-type="user.type"></span>
    <span class="refresher-user-nick">{{user.nick}}</span>
    <span class="refresher-user-info">{{user.id ? '(' + user.id + ')' : user.ip ? '(' + user.ip + (user.ip_data ? ', ' + (user.ip_data.length > 100 ? user.ip_data.substring(0, 97) + '...' : user.ip_data) : '') + ')' : ''}}</span>
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
  },
  methods: {
    openLink (url: string) {
      window.open(url, '_blank')
    },

    clickHandle () {
      if (this.user.id) {
        this.openLink('https://gallog.dcinside.com/' + this.user.id)
      }
    },

    contextMenu () {
      eventBus.emit(
        'RefresherAddToBlock',
        this.user.nick,
        this.user.id,
        this.user.ip
      )
    }
  }
}
