var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var w = d * 7
var y = d * 365.25

let timeCounts = [y, w, d, h, m, s]
let timeFilters = ['년', '주', '일', '시간', '분', '초']

const convertTime = (date: Date) => {
  let elapsed = Date.now() - date.getTime()

  if (elapsed < 3000) {
    return '방금 전'
  }

  let abs = Math.abs(elapsed)
  for (let f = 0; f < timeCounts.length; f++) {
    if (abs >= timeCounts[f]) {
      return Math.round(elapsed / timeCounts[f]) + timeFilters[f] + ' 전'
    }
  }

  return '아주 오래 전'
}

export default {
  template: `<div class="refresher-timestamp" v-on:click="this.$root.changeStamp" :title="locale">
    <transition name="refresher-opacity">
      <span :key="'stamp' + this.$root.stampMode">{{this.$root.stampMode ? locale : stamp}}</span>
    </transition>
  </div>`,
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data: () => {
    return {
      mode: 0,
      stamp: ''
    }
  },
  computed: {
    locale (): string {
      return this.date.toLocaleString()
    }
  },
  mounted () {
    this.stamp = convertTime(this.date)

    this.updates = setInterval(() => {
      this.stamp = convertTime(this.date)
    }, 3000)
  },

  beforeUnload () {
    clearInterval(this.updates)
  }
}
