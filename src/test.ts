import Vue from 'vue'
import Frame from './core/frame'
import PreviewButton from './components/button'

const createFrame = () => {
  let frame = new Frame(
    [
      {
        relative: true,
        center: true,
        preview: true,
        blur: true
      },

      {
        relative: true,
        center: true,
        preview: true,
        blur: true
      }
    ],
    {
      background: true,
      groupOnce: true,
      onScroll: (ev, app, group: HTMLElement) => {
        // TODO : Implement macOS, Windows scroll bending
        // if (group.scrollTop === 0 || group.scrollTop + window.innerHeight >= group?.scrollHeight) {
        //   group.style.top = (ev.deltaY * -1) + 'px'
        // }
      }
    }
  )

  frame.app.fadeIn()

  return true
}

let app = new Vue({
  el: '#test-app',
  template: `
    <PreviewButton id="upvote" text="프레임 열기" :click="openFrame"></PreviewButton>
  `,
  data: () => {
    return {}
  },
  methods: {
    openFrame () {
      createFrame()
    }
  },
  mounted () {},
  components: {
    PreviewButton
  }
})
