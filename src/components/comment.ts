import User from './user'
import TimeStamp from './timestamp'
import { eventBus } from '../core/eventbus'

const NRegex = /(ㄴ)(\s)?([^ ]+)/g

export default {
  components: {
    TimeStamp,
    User
  },
  template: `<div class="refresher-comment" :data-depth="comment.depth" :data-rereply="rereply" :data-deleted="comment.del_yn === 'Y'">
    <div class="meta">
      <User :user="comment.user" :me="me"></User>
      <div class="float-right">
        <TimeStamp :date="new Date(date(comment.reg_date))"></TimeStamp>
      </div>
    </div>
    <div v-if="comment.vr_player">
      <audio :src="getVoiceData.src" controls></audio>
      <p v-if="getVoiceData.memo">{{getVoiceData.memo}}</p>
    </div>
    <p v-else class="refresher-comment-content" :class="{dccon: comment.memo.indexOf('<img class=') > -1}" v-html="comment.memo"></p>
  </div>`,
  data () {
    return {
      currentId: '',
      me: false,
      rereply: false
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    },

    index: {
      type: Number
    },

    postUser: {
      type: String
    }
  },
  mounted () {
    this.rereply = this.checkReReply()

    if (!this.comment.user.id) {
      return
    }

    let gallogImageElement = document.querySelector(
      '#login_box .user_info .writer_nikcon > img'
    ) as HTMLImageElement

    let click = gallogImageElement && gallogImageElement.getAttribute('onclick')

    if (click) {
      this.currentId = click
        .replace(/window\.open\(\'\/\/gallog\.dcinside\.com\//g, '')
        .replace(/\'\)\;/g, '')

      this.me = this.currentId === this.comment.user.id
    }

    if (!this.me && this.postUser) {
      this.me = this.postUser === this.comment.user.id
    }

    if (!this.me && !this.postUser) {
      eventBus.on(
        'RefresherPostDataLoaded',
        (obj: PostInfo) => {
          this.me = (obj.user && obj.user.id) === this.comment.user.id
        },
        {
          once: true
        }
      )
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
        ? `${new Date().getFullYear()}-${str.replace(/\./g, '-')}`
        : str.replace(/\./g, '-')
    },

    extractID (str: string) {
      let match = str.match(/gallog\.dcinside.com\/.+\'/g)
      return match ? match[0].replace(/gallog\.dcinside.com\/|\'/g, '') : null
    },

    checkReReply (): boolean {
      let content = this.comment.memo
      let depth = this.comment.depth

      if (depth < 1) {
        return false
      }

      if (
        !NRegex.test(content) ||
        content.indexOf('ㄴ') !== 0 ||
        content.indexOf('ㄴㄴ') === 0
      ) {
        return false
      }

      return true
    }
  }
}
