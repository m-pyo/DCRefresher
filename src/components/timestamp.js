const Vue = require('vue')

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var w = d * 7
var y = d * 365.25

Vue.component('refresher-timestamp', {
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
    locale() {
      return this.date.toLocaleString()
    }
  },
  methods: {
    convertTime () {
      let elapsed = Date.now() - this.date

      if (elapsed < 3000) {
        return '방금 전'
      }

      let filter = [y, w, d, h, m, s]
      let filtername = ['년', '주', '일', '시간', '분', '초']

      let abs = Math.abs(elapsed)
      for (let f = 0; f < filter.length; f++) {
        if (abs >= filter[f]) {
          return Math.round(elapsed / filter[f]) + filtername[f] + ' 전'
        }
      }
    },
  },
  mounted() {
    this.stamp = this.convertTime(this.date)

    this.updates = setInterval(() => {
      this.stamp = this.convertTime(this.date)
    }, 3000)
  },

  beforeUnload() {
    clearInterval(this.updates)
  }
})
