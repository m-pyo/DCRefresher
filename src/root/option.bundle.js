const ImageLists = {
    icon: '/assets/icons/logo/Icon.png'
}

const runtime = (chrome && chrome.runtime) || (browser && browser.runtime)
const stor = (window.chrome && window.chrome.storage) || storage

let port = runtime.connect({name: 'refresherInternal'})

document.addEventListener('DOMContentLoaded', () => {
    let app = new Vue({
        el: '#refresher-app',
        data: () => {
            return {
                tab: 0,
                modules: [],
                settings: {},
                blocks: {},
                blockModes: {},
                blockKeyNames: {
                    NICK: '닉네임',
                    ID: '아이디',
                    IP: 'IP',
                    TEXT: '내용',
                    DCCON: '디시콘'
                },
                links: [
                    {
                        text: 'GitHub',
                        url: 'https://github.com/So-chiru/DCRefresher'
                    },
                    {
                        text: '개발자 후원',
                        url: 'https://github.com/So-chiru/So-chiru/blob/master/DONATION.md'
                    },
                    {
                        text: '리뷰 남기기',
                        url: /Chrome/.test(navigator.userAgent)
                            ? 'https://chrome.google.com/webstore/detail/dc-refresher/gpipaoeekcphlmilndfdbfdgijjjiklh'
                            : 'https://addons.mozilla.org/en-US/firefox/addon/dc-refresher/'
                    }
                ]
            }
        },

        methods: {
            open(url) {
                window.open(url, '_blank')
            },

            advancedSettingsCount(obj) {
                return Object.keys(obj).filter(v => obj[v] && obj[v].advanced).length
            },

            updateUserSetting(module, key, value) {
                this.settings[module][key].value = value

                port.postMessage({
                    updateUserSetting: true,
                    name: module,
                    key,
                    value,
                    settings_store: this.settings
                })

                chrome.tabs.query({active: true}, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        updateUserSetting: true,
                        name: module,
                        key,
                        value
                    })
                })
            },

            syncBlock() {
                port.postMessage({
                    updateBlocks: true,
                    blocks_store: this.blocks,
                    blockModes_store: this.blockModes
                })

                chrome.tabs.query({active: true}, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        updateBlocks: true,
                        blocks_store: this.blocks,
                        blockModes_store: this.blockModes
                    })
                })

                debugger
            },

            addEmptyBlockedUser(key) {
                let result = prompt(
                    `추가할 ${this.blockKeyNames[key]} 값을 입력하세요.`,
                    ''
                )

                if (!result || result.length < 1) {
                    return
                }

                this.blocks[key].push({
                    content: result
                })
                this.syncBlock()
            },

            removeBlockedUser(key, index) {
                this.blocks[key].splice(index, 1)
                this.syncBlock()
            },

            editBlockedUser(key, index) {
                let result = prompt(
                    `바꿀 ${this.blockKeyNames[key]} 값을 입력하세요.`,
                    this.blocks[key][index].content
                )

                if (!result || result.length < 1) {
                    return
                }

                if (result !== this.blocks[key][index].content) {
                    this.blocks[key][index].extra = ''
                }

                this.blocks[key][index].content = result
                this.syncBlock()
            }
        }
    })

    document.querySelectorAll('img[data-image]').forEach(v => {
        v.src = chrome.extension.getURL(ImageLists[v.dataset.image])
    })

    port.postMessage({
        requestRefresherModules: true
    })

    port.postMessage({
        requestRefresherSettings: true
    })

    port.postMessage({
        requestRefresherBlocks: true
    })

    port.onMessage.addListener(msg => {
        if (msg.responseRefresherModules) {
            app.$data.modules = msg.modules || {}
        }

        if (msg.responseRefresherSettings) {
            app.$data.settings = msg.settings || {}
        }

        if (msg.responseRefresherBlocks) {
            app.$data.blocks = msg.blocks || {}
            app.$data.blockModes = msg.blockModes || {}
        }
    })
})

Vue.component('refresher-module', {
    template: `
      <div class="refresher-module">
      <div class="left">
        <p class="title">{{ name }}</p>
        <p class="desc">{{ desc }}</p>
        <p class="mute">개발자 : <span class="link" v-if="typeof author === 'object'"
                                    v-on:click="() => openLink(author && author.url)">{{ author.name }}</span><span
            v-else>{{ author || '알 수 없음' }}</span>, 요구 유틸 : {{ require.join(', ') || '없음' }}</p>
      </div>
      <div class="right">
        <refresher-checkbox :checked="enabled" :change="update"></refresher-checkbox>
      </div>
      </div>`,

    props: {
        name: {
            type: String,
            required: true
        },

        desc: {
            type: String,
            required: true
        },

        author: {
            type: [String, Object],
            required: false
        },

        require: {
            type: Array,
            required: false
        },

        enabled: {
            type: Boolean,
            required: true
        }
    },

    methods: {
        update(_module, _key, value) {
            let obj = {}
            obj[`${this.name}.enable`] = value
            stor.sync.set(obj)

            if (this.name === '광고 차단') {
                port.postMessage({
                    toggleAdBlock: value
                })
            }

            chrome.tabs.query({active: true}, tabs => {
                tabs.forEach(v => {
                    chrome.tabs.sendMessage(v.id, {
                        updateModuleSettings: true,
                        name: this.name,
                        value: value
                    })
                })
            })
        },

        openLink(url) {
            if (!url) {
                return
            }

            window.open(url, '_blank')
        }
    }
})

Vue.component('refresher-checkbox', {
    template: `
      <div class="refresher-checkbox" :data-id="id" :data-module="modname" :class="{disabled: disabled}" :data-on="on"
           v-on:click="toggle">
      <div class="selected"
           :style="{transform: 'translateX(' + (typeof translateX !== 'undefined' ? translateX : (this.on ? 18 : 0)) + 'px)'}"
           v-on:pointermove="hover" v-on:pointerdown="down" v-on:pointerup="up" v-on:pointerout="out">
      </div>
      </div>`,

    props: {
        change: {
            type: Function
        },

        modname: {
            type: String,
            required: false
        },

        id: {
            type: String
        },

        checked: {
            type: Boolean
        },

        disabled: {
            type: Boolean
        }
    },

    data() {
        return {
            on: this.checked,
            _down: false,
            translateX: undefined,
            onceOut: false
        }
    },

    methods: {
        toggle() {
            if (this.disabled) {
                return
            }

            if (this.onceOut) {
                this.onceOut = false

                return
            }

            this.on = !this.on

            this.change &&
            this.change(this.$el.dataset.module, this.$el.dataset.id, this.on)
        },

        hover(ev) {
            if (this.disabled) {
                return
            }

            if (this._down) {
                this.translateX = Math.ceil(ev.offsetX)
            }
        },

        down(ev) {
            if (this.disabled) {
                return
            }

            this._down = true
        },

        up(ev) {
            if (this.disabled) {
                return
            }

            this._down = false
            this.translateX = undefined
        },
        out() {
            if (this.disabled) {
                return
            }

            if (this._down) {
                this._down = false
                this.translateX = undefined
                this.toggle()

                this.onceOut = true
            }
        }
    }
})

Vue.component('refresher-options', {
    template: `
      <div class="refresher-options" :data-id="id" :data-on="on" v-on:click="toggle">
      <select :disabled="disabled">
        <option v-for="(name, index) in options" value="index">{{ name }}</option>
      </select>
      </div>`,

    props: {
        options: {
            type: Array
        },

        id: {
            type: String
        },

        disabled: {
            type: Boolean
        }
    }
})

Vue.component('refresher-input', {
    template: `
      <div class="refresher-input">
      <input type="text" :data-id="id" :data-module="modname" :placeholder="placeholder" :value="value"
             :disabled="disabled" v-on:change="update"></input>
      </div>`,

    props: {
        change: {
            type: Function
        },

        placeholder: {
            type: String,
            required: false
        },

        modname: {
            type: String
        },

        id: {
            type: String
        },

        value: {
            type: String
        },

        disabled: {
            type: Boolean
        }
    },

    methods: {
        update(ev) {
            if (this.change) {
                this.change(
                    ev.target.dataset.module,
                    ev.target.dataset.id,
                    ev.target.value
                )
            }
        }
    }
})

Vue.component('refresher-range', {
    template: `
      <div class="refresher-range">
      <input type="range" :data-id="id" :data-module="modname" :placeholder="placeholder" :value="value"
             :disabled="disabled" v-on:input="input" v-on:change="update" :max="max" :min="min" :step="step"></input>
      <span class="indicator">{{ value + (this.unit ? this.unit : '') }}</span>
      </div>`,

    props: {
        change: {
            type: Function
        },

        placeholder: {
            type: Number,
            required: false
        },

        modname: {
            type: String
        },

        id: {
            type: String
        },

        value: {
            type: Number
        },

        max: {
            type: Number
        },

        min: {
            type: Number
        },

        step: {
            type: Number
        },

        unit: {
            type: String
        },

        disabled: {
            type: Boolean
        }
    },

    methods: {
        input(ev) {
            this.$el.querySelector('.indicator').innerHTML =
                ev.target.value + (this.unit ? this.unit : '')
        },

        update(ev) {
            if (this.change) {
                this.change(
                    ev.target.dataset.module,
                    ev.target.dataset.id,
                    ev.target.value
                )
            }
        }
    },

    mounted() {
        this.$data.__temp = this.value
    }
})

Vue.component('refresher-bubble', {
    template: `
      <div class="refresher-bubble">
      <span class="text" v-on:click="safeTextClick">{{ text }}{{ extra ? ' (' + extra + ')' : '' }}<span class="gallery"
                                                                                                         v-if="gallery">({{ gallery }}
        )</span></span>
      <span class="remove" v-on:click="safeRemoveClick"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                             viewBox="0 0 18 18"><path
          d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg></span>
      </div>`,

    props: {
        text: {
            type: String,
            required: true
        },

        isRegex: {
            type: Boolean
        },

        gallery: {
            type: String
        },

        extra: {
            type: String
        },

        remove: {
            type: Function
        },

        textclick: {
            type: Function
        }
    },

    methods: {
        safeTextClick() {
            if (this.textclick) {
                this.textclick()
            }
        },

        safeRemoveClick() {
            if (this.remove) {
                this.remove()
            }
        }
    }
})


Vue.component('refresher-dccon', {
    template: `
      <div class="refresher-input">
      <img v-bind:src="'https://dcimg5.dcinside.com/dccon.php?no='+value.split('||')[2]" alt="디시콘"
           style="width: 37px;position: relative;left: -70px;">
      <button v-on:click="select" :data-id="id" :data-module="modname" :placeholder="placeholder" :value="value"
              :disabled="disabled"
              style="position: absolute;right: 10px;top: 5px;background: #dddddd;border: none;padding: 5px 10px;">선택하기
      </button>
      </div>`,

    props: {
        change: {
            type: Function
        },

        placeholder: {
            type: String,
            required: false
        },

        modname: {
            type: String
        },

        id: {
            type: String
        },

        value: {
            type: String
        },

        disabled: {
            type: Boolean
        }
    },

    methods: {
        select(ev) {
            chrome.windows.create({
                'url': 'views/dcconSel.html',
                'type': 'popup',
                height: 800,
                width: 400
            }, function (window) {
            });
            window.close()
        }
    }
})
