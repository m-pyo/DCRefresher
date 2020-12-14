var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var w = d * 7
var y = d * 365.25

let timeCounts = [y, w, d, h, m, s]
let timeFilters = ['년', '주', '일', '시간', '분', '초']

const convertTime = (date: Date) => {
  let estimate = date.getTime() - Date.now()

  if (estimate < 3000) {
    return '잠시 후'
  }

  let abs = Math.abs(estimate)
  for (let f = 0; f < timeCounts.length; f++) {
    if (abs >= timeCounts[f]) {
      return Math.round(estimate / timeCounts[f]) + timeFilters[f] + ' 후'
    }
  }

  return '이미 삭제 됨'
}

export default {
  template: `<div class="refresher-countdown" v-on:click="this.$root.changeStamp" :title="locale">
    <transition name="refresher-opacity">
      <span :key="'stamp' + this.$root.stampMode">삭제 : {{this.$root.stampMode ? locale : stamp}}</span>
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
  mounted() {
    this.stamp = convertTime(this.date)

    this.updates = setInterval(() => {
      this.stamp = convertTime(this.date)
    }, 5000)
  },

  beforeUnload () {
    clearInterval(this.updates)
  }
}
