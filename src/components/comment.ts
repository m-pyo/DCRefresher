import User from './user'
import TimeStamp from './timestamp'

const NRegex = /(ㄴ)(\s)?/

export default {
  components: {
    TimeStamp,
    User
  },
  template: `<div class="refresher-comment" :data-depth="comment.depth" :data-rereply="checkReReply(comment.memo)" :data-deleted="comment.del_yn === 'Y'">
    <div class="meta">
      <User :user="comment.user" :me="checkParticipant(comment.user.id)"></User>
      <div class="float-right">
        <TimeStamp :date="new Date(date(comment.reg_date))"></TimeStamp>
      </div>
    </div>
    <div v-if="comment.vr_player">
      <audio :src="getVoiceData.src" controls></audio>
      <p v-if="getVoiceData.memo">{{getVoiceData.memo}}</p>
    </div>
    <p v-else class="refresher-comment-content" v-html="comment.memo"></p>
  </div>`,
  props: {
    comment: {
      type: Object,
      required: true
    },

    index: {
      type: Number
    },

    parentUser: {
      type: Object
    }
  },
  computed: {
    getVoiceData (): { [index: string]: string } | null {
      if (!this.comment.vr_player) {
        return null
      }

      let memo = this.comment.memo.split('@^dc^@')
      return { src: 'https://vr.dcinside.com/' + memo[0], memo: memo[1] }
    }
  },
  methods: {
    date (str: string) {
      return str.substring(0, 4).match(/\./)
        ? `${new Date().getFullYear()}.${str}`
        : str
    },

    extractID (str: string) {
      let match = str.match(/gallog\.dcinside.com\/.+\'/g)
      return match ? match[0].replace(/gallog\.dcinside.com\/|\'/g, '') : null
    },

    checkParticipant (id: string): boolean {
      let same = false

      if (!id) {
        return false
      }

      let loginid = document.querySelector('#login_box .user_option a')
      if (loginid) {
        same = this.extractID(loginid.getAttribute('onclick') || '') === id
      }

      let post = document.querySelector(
        '.gallview_head .gall_writer'
      ) as HTMLElement
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
    },

    checkReReply (content: string): boolean {
      if (!NRegex.test(content)) {
        return false
      }

      let matched = content.match(NRegex)

      if (
        content.indexOf('ㄴ') !== 0 ||
        content.indexOf('ㄴㄴ') === 0 ||
        !matched ||
        !matched[0]
      ) {
        return false
      }

      return true
    }
  }
}
