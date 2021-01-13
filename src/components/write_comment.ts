import PreviewButton from './button'

export default {
  components: {
    PreviewButton
  },
  template: `<div class="refresher-write-comment">
    <div class="input-wrap" :class="{focus: focused, disable: disabled}">
      <input id="comment_main" type="text" v-on:focus="focus" v-on:blur="blur" v-on:keydown="type" :disabled="disabled"></input>
    </div>
    <PreviewButton class="refresher-writecomment primary" id="write" text="작성" :click="write"></PreviewButton>
  </div>`,
  data () {
    return {
      focused: false,
      disabled: false
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
        let value = this.$el.querySelector('input').value

        let result = await this.func('text', value)

        console.log(result)
      }
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
