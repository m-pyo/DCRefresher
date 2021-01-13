import PreviewButton from './button'

export default {
  components: {
    PreviewButton
  },
  template: `<div class="refresher-write-comment">
    <div class="user">
      <input type="text" placeholder="닉네임"></input>
      <div></div>
      <input type="password" placeholder="비밀번호"></input>
    </div>
    <div class="refresher-comment-body">
      <div class="input-wrap" :class="{focus: focused, disable: disabled}">
        <input id="comment_main" placeholder="댓글 입력..." v-model="text" type="text" v-on:focus="focus" v-on:blur="blur"
               v-on:keydown="type" :disabled="disabled"/>
      </div>
      <PreviewButton class="refresher-writecomment primary" id="write" text="작성" :click="write"></PreviewButton>
    </div>
  </div>`,
  data () {
    return {
      focused: false,
      disabled: false,
      text: ''
    }
  },
  props: {
    func: {
      type: Function
    }
  },
  mounted () {},
  methods: {
    async write () {
      this.disabled = true

      if (this.func) {
        let result = await this.func('text', this.text)
        this.disabled = false
        this.text = ''
        return result
      }

      return true
    },

    focus () {
      this.focused = true
      this.$root.inputFocus = true
    },

    blur () {
      this.focused = false
      this.$root.inputFocus = false
    },

    type (ev: KeyboardEvent) {
      if (ev.key !== 'Enter') {
        return ev
      }

      this.write()
    }
  }
}
