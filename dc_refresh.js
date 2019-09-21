/**
 * URL의 QueryString에서 name의 값을 가져옵니다.
 *
 * @param {String} name 쿼리의 이름 ex:) ?id=XXX : name = id
 * @param {String} url URL, 미지정시 window.location.href 사용
 * @copyright https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */
let getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')

  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * 옵션을 Sync API를 사용해 저장합니다.
 * @param {String} key 저장할 값의 key ID
 * @param {String} value 저장할 값
 */
const save_opt = (key, value) => {
  var d = {}
  d[key] = value

  if (chrome) {
    return chrome.storage.sync.set(d, () => {})
  }

  return browser.storage.local.set(d, () => {})
}

/**
 * 옵션을 Sync API를 사용해 불러옵니다.
 * @param {String} key 불러올 값의 key ID
 */
const get_opt = async key => {
  return new Promise((resolve, reject) => {
    try {
      let resolve_func = i => {
        resolve(i[key])
      }

      if (chrome) {
        chrome.storage.sync.get(key, resolve_func)
      } else {
        browser.storage.local.get(key)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 쿠키를 가져옵니다.
 * @param {String} name 쿠키 key 이름
 */
let getCookie = name => {
  var value = '; ' + document.cookie
  var parts = value.split('; ' + name + '=')
  if (parts.length == 2) {
    return parts
      .pop()
      .split(';')
      .shift()
  }
}

// 초기화 변수
let pgId = getParameterByName('id')
let cachedNew = []
let gTableOrigin
let outerTooltip
let isMinor = /dcinside\.com\/mgallery/g.test(window.location.href)
let pgNum = getParameterByName('page') || 1
let isPageSpec = pgNum != null
let centrePage = true
let darkMode = false
let blockNotLogin = false
let refreshRate = 5000
let fetchURL =
  'https://gall.dcinside.com/' +
  (isMinor ? 'mgallery/' : '') +
  'board/lists' +
  window.location.search

get_opt('dark_mode')
  .then(v => {
    darkMode = v
  })
  .catch(e => {
    console.log(e)
  })

get_opt('centre_page')
  .then(v => {
    centrePage = v
  })
  .catch(e => {
    console.log(e)
  })

get_opt('block_notlogin')
  .then(v => {
    blockNotLogin = v
  })
  .catch(e => {
    console.log(e)
  })

get_opt('refresh_rate')
  .then(v => {
    refreshRate = Number(v)
  })
  .catch(e => {
    console.log(e)
  })

get_opt('blocked_dccon')
  .then(v => {
    DCCon.block.lists = JSON.parse(v)
  })
  .catch(e => {
    console.log(e)
  })

let DCRefresher = {
  util: {
    shake: e => {
      e.classList.add('__hoverBox_shakeAnime')

      setTimeout(() => {
        e.classList.remove('__hoverBox_shakeAnime')
      }, 321)
    }
  },

  object: {
    ip: {
      '203.226': 'skt3g',
      '211.234': 'skt3g',
      '203.226': 'sktlte',
      '223.32': 'sktlte',
      '223.33': 'sktlte',
      '223.34': 'sktlte',
      '223.35': 'sktlte',
      '223.36': 'sktlte',
      '223.37': 'sktlte',
      '223.38': 'sktlte',
      '223.39': 'sktlte',
      '223.40': 'sktlte',
      '223.41': 'sktlte',
      '223.42': 'sktlte',
      '223.43': 'sktlte',
      '223.44': 'sktlte',
      '223.45': 'sktlte',
      '223.46': 'sktlte',
      '223.47': 'sktlte',
      '223.48': 'sktlte',
      '223.49': 'sktlte',
      '223.50': 'sktlte',
      '223.51': 'sktlte',
      '223.52': 'sktlte',
      '223.53': 'sktlte',
      '223.54': 'sktlte',
      '223.55': 'sktlte',
      '223.56': 'sktlte',
      '223.57': 'sktlte',
      '223.58': 'sktlte',
      '223.59': 'sktlte',
      '223.60': 'sktlte',
      '223.61': 'sktlte',
      '223.62': 'sktlte',
      '223.63': 'sktlte',
      '39.7': 'kt',
      '110.70': 'kt',
      '175.223': 'kt',
      '175.252': 'kt',
      '211.246': 'kt',
      '118.235': 'kt5g',
      '61.43': 'up3g',
      '211.234': 'up3g',
      '117.111': 'uplte',
      '211.36': 'uplte',
      '106.102': 'uplte',
      '106.101': 'up5g',
      '60.100': 'sftb',
      '60.106': 'sftb',
      '60.107': 'sftb',
      '60.108': 'sftb',
      '60.109': 'sftb',
      '60.110': 'sftb',
      '60.111': 'sftb',
      '60.112': 'sftb',
      '60.113': 'sftb',
      '60.114': 'sftb',
      '60.115': 'sftb',
      '60.116': 'sftb',
      '60.117': 'sftb',
      '60.118': 'sftb',
      '60.119': 'sftb',
      '60.120': 'sftb',
      '60.121': 'sftb',
      '60.122': 'sftb',
      '60.123': 'sftb',
      '60.124': 'sftb',
      '60.125': 'sftb',
      '60.126': 'sftb',
      '60.127': 'sftb',
      '60.128': 'sftb',
      '60.129': 'sftb',
      '60.130': 'sftb',
      '60.131': 'sftb',
      '60.132': 'sftb',
      '60.133': 'sftb',
      '60.134': 'sftb',
      '60.135': 'sftb',
      '60.136': 'sftb',
      '60.137': 'sftb',
      '60.138': 'sftb',
      '60.139': 'sftb',
      '60.140': 'sftb',
      '60.141': 'sftb',
      '60.142': 'sftb',
      '60.143': 'sftb',
      '60.144': 'sftb',
      '60.146': 'sftb',
      '60.147': 'sftb',
      '60.148': 'sftb',
      '60.149': 'sftb',
      '60.150': 'sftb',
      '60.40': 'sftb',
      '60.80': 'sftb',
      '60.86': 'sftb',
      '60.90': 'sftb',
      '60.91': 'sftb',
      '60.94': 'sftb',
      '60.96': 'sftb',
      '60.97': 'sftb',
      '126.204': 'sftb',
      '126.206': 'sftb',
      '126.234': 'sftb',
      '126.235': 'sftb',
      '126.236': 'sftb',
      '126.237': 'sftb',
      '126.238': 'sftb',
      '126.239': 'sftb',
      '126.240': 'sftb',
      '126.241': 'sftb',
      '126.242': 'sftb',
      '126.33': 'sftb',
      '126.40': 'sftb',
      '126.43': 'sftb',
      '1.66': 'docomo',
      '1.72': 'docomo',
      '1.73': 'docomo',
      '1.75': 'docomo',
      '1.78': 'docomo',
      '1.79': 'docomo',
      '49.96': 'docomo',
      '49.97': 'docomo',
      '49.98': 'docomo',
      '49.99': 'docomo',
      '49.100': 'docomo',
      '49.104': 'docomo',
      '49.105': 'docomo',
      '49.106': 'docomo',
      '49.110': 'docomo',
      '49.111': 'docomo',
      '110.163': 'docomo',
      '220.159': 'docomo',
      '111.239': 'au',
      '13.125': 'aws',
      '54.180': 'aws',
      '52.92': 'aws',
      '52.93': 'aws',
      '52.94': 'aws',
      '52.95': 'aws',
      '52.79': 'aws',
      '13.124': 'aws',
      '13.209': 'aws',
      '52.78': 'aws',
      '15.164': 'aws',
      '99.78': 'aws',
      '54.193': 'aws',
      '54.238': 'aws',
      '54.168': 'aws',
      '52.74': 'aws',
      '52.18': 'aws',
      '52.79': 'aws',
      '52.61': 'aws',
      '52.58': 'aws',
      '18.230': 'aws',
      '184.72': 'aws',
      '52.29': 'aws',
      '13.124': 'aws',
      '15.164': 'aws',
      '34.64': 'gcp',
      '34.96': 'gcp',
      '34.98': 'gcp',
      '35.184': 'gcp',
      '35.188': 'gcp',
      '35.190': 'gcp',
      '35.192': 'gcp',
      '35.196': 'gcp',
      '35.199': 'gcp',
      '35.198': 'gcp',
      '35.200': 'gcp',
      '35.202': 'gcp',
      '35.203': 'gcp',
      '35.204': 'gcp',
      '35.206': 'gcp',
      '35.208': 'gcp',
      '35.216': 'gcp',
      '35.220': 'gcp',
      '35.224': 'gcp',
      '35.234': 'gcp',
      '35.235': 'gcp',
      '35.236': 'gcp',
      '35.240': 'gcp',
      '35.242': 'gcp',
      '35.244': 'gcp',
      '104.154': 'gcp',
      '104.196': 'gcp',
      '146.148': 'gcp',
      '108.170': 'gcp',
      '107.167': 'gcp',
      '107.179': 'gcp',
      '139.28': 'bnet',
      '185.209': 'bnet',
      '76.164': 'bnet',
      '64.188': 'bnet',
      '13.231': 'vpncat',
      '13.231': 'vpnmst',
      '108.61': 'vultr',
      '173.199': 'vultr',
      '31.171': 'zenmate',
      '37.120': 'zenmate',
      '27.50': 'zenmate',
      '185.242': 'zenmate',
      '27.255': 'zenmate',
      '154.6': 'zenmate',
      '193.7': 'zenmate',
      '212.103': 'zenmate'
    },

    ip_lis: {
      skt3g: {
        text: 'SKT 3G'
      },
      sktlte: {
        text: 'SKT LTE'
      },
      kt: {
        text: 'KT'
      },
      kt5g: {
        text: 'KT 5G'
      },
      up3g: {
        text: 'U+ 3G'
      },
      uplte: {
        text: 'U+ LTE'
      },
      up5g: {
        text: 'U+ 5G'
      },
      docomo: {
        text: 'JP docomo'
      },
      sftb: {
        text: 'JP Softbank'
      },
      au: {
        text: 'JP au'
      },
      aws: {
        text: 'AWS (클라우드)'
      },
      gcp: {
        text: 'GCP (클라우드)'
      },
      vultr: {
        text: 'Vultr (클라우드)'
      },
      bnet: {
        text: 'Betternet VPN'
      },
      vpncat: {
        text: 'VPN Cat'
      },
      vpnmst: {
        text: 'VPN Master'
      },
      zenmate: {
        text: 'Zenmate (VPN)'
      }
    }
  }
}

let DCCon = {
  block: {
    lists: {},
    save: (k, s) => {
      DCCon.block.lists[k] = s
      save_opt('blocked_dccon', JSON.stringify(DCCon.block.lists))
    },
    remove: k => {
      delete DCCon.block.lists[k]
      save_opt('blocked_dccon', JSON.stringify(DCCon.block.lists))
    },
    /**
     * 해당 URL이 차단된 디시콘 목록에 있는지 확인합니다.
     * @param {*} url DC콘 URL
     */
    check: url => {
      url =
        url.indexOf('dcinside.com') != -1 ? getParameterByName('no', url) : url
      var cacheKeyObj = Object.keys(DCCon.block.lists)

      var r = false
      cacheKeyObj.forEach(en => {
        if (
          url != '' &&
          typeof DCCon.block.lists[en] !== 'undefined' &&
          typeof DCCon.block.lists[en].l !== 'undefined' &&
          DCCon.block.lists[en].l.indexOf(url) != -1
        ) {
          r = true
        }
      })
      return r
    }
  },
  util: {
    serialize: detail_con => {
      let u = ''
      detail_con.forEach(v => {
        u += v.path + '|'
      })

      return u
    }
  },
  popup: {
    handler: (f_elem, src) => {
      f_elem.addEventListener('click', async ev => {
        if (!ev.isTrusted) return false

        var con_id = getParameterByName('no', src)
        var createdOverlay = await createTooltipOverlay(con_id, true)
        createOuterDCOverlay(createdOverlay)

        fillWithLoader(createdOverlay)
        recalcOverlay(createdOverlay, ev)

        var cookieCi_t = getCookie('ci_c')
        DCCon.network.fetch(cookieCi_t, '', con_id).then(async data => {
          DCCon.popup.render(
            createdOverlay,
            ev,
            data,
            typeof DCCon.block.lists[data.info.package_idx] !== 'undefined' &&
              Object.keys(DCCon.block.lists[data.info.package_idx]).length !==
                0,
            data.info.residual,
            cookieCi_t
          )
          recalcOverlay(createdOverlay, ev)
        })
      })
    },

    render: (createdOverlay, ev, data, getBlocked, getPurchased, ci_c) => {
      createdOverlay.innerHTML = ''
      let cntWrap = document.createElement('div')
      cntWrap.className = '__hoverBox_contentWrap'

      cntWrap.innerHTML = `
            <div class="__hoverConBox_alignCenter">
              <div class="__hoverConBox_mainImg">
                <img id="__hoverConBox_img_${
  data.info.main_img_path
}" src="https://dcimg5.dcinside.com/dccon.php?no=${
  data.info.main_img_path
}"></img>
              </div>
              <div class="__hoverConBox_title">
                ${data.info.title}
              </div>
              <div class="__hoverConBox_desc">
                ${data.info.description}
              </div>
              <div class="__hoverConBox_info_detail">
                by ${data.info.seller_name} | 등록일 ${
  data.info.reg_date_short
} | ${data.info.sale_count}회 판매
              </div>
            </div>
            <div class="__hoverBox_bottom">
            <div class="__hoverBox_voteWrap">
                <div class="__hoverBox_purchaseWrap" id="__hoverBox_purchaseId_${
  data.info.package_idx
}">
                  <img src="${chrome.extension.getURL(
    '/icns/downvote.png'
  )}" class="__hoverBox_voteIcon"></img>
                  <div class="__hoverBox_btnCountsText${
  getPurchased ? ' __hoverBox_purchased' : ''
}" id="__hoverBox_purchaseBtn">${
  getPurchased
    ? '이미 소유중 (' + data.info.residual + '일 남음)'
    : '디시콘 구매'
}</div>
                </div>
                <div class="__hoverBox_blockWrap" id="__hoverBox_blockConId_${
  data.info.package_idx
}">
                  <img src="${chrome.extension.getURL(
    '/icns/block.png'
  )}" class="__hoverBox_voteIcon"></img>
                  <div class="__hoverBox_btnCountsText" id="__hoverBox_blockBtn">${
  getBlocked ? '차단 해제' : '차단'
}</div>
          </div>
      </div>
    </div>
    <div class="__hoverBox_seperater"></div>
          `

      for (var i = 0; i < data.detail.length; i++) {
        var dcconImg = document.createElement('img')
        dcconImg.className = '__hoverConBox_img_more'
        dcconImg.src =
          'https://dcimg5.dcinside.com/dccon.php?no=' + data.detail[i].path

        cntWrap.appendChild(dcconImg)
      }
      createdOverlay.appendChild(cntWrap)

      document
        .getElementById('__hoverConBox_img_' + data.info.main_img_path)
        .addEventListener('load', () => {
          recalcOverlay(createdOverlay, ev)
        })

      document
        .getElementById('__hoverBox_purchaseId_' + data.info.package_idx)
        .addEventListener('click', async ev => {
          if (!getPurchased) {
            try {
              var tokens = await DCCon.network.getToken(document.cookie)

              var buyInfo = await DCCon.network.info(tokens, 'A08')

              if (buyInfo.indexOf('ok') != -1) {
                var boughtResponse = await DCCon.network.buy(
                  tokens,
                  data.info.package_idx
                )
              }
            } catch (e) {
              console.error(e)

              DCRefresher.util.shake(
                document.getElementById('__hoverBox_purchaseBtn')
              )
              alert('디시콘을 구매하는 도중 오류가 발생 하였습니다.')
              return false
            }
          } else {
            DCRefresher.util.shake(
              document.getElementById('__hoverBox_purchaseBtn')
            )
            return false
          }

          if (boughtResponse != 'ok') {
            DCRefresher.util.shake(
              document.getElementById('__hoverBox_purchaseBtn')
            )
            alert(boughtResponse)
            return
          }

          getPurchased = true
          document.getElementById('__hoverBox_purchaseBtn').innerHTML =
            '이미 구매한 디시콘'

          recalcOverlay(createdOverlay, ev)
        })

      document
        .getElementById('__hoverBox_blockConId_' + data.info.package_idx)
        .addEventListener('click', ev => {
          if (getBlocked) {
            DCCon.block.remove(data.info.package_idx)
          } else {
            DCCon.block.save(data.info.package_idx, {
              n: data.info.title,
              s: data.info.seller_name,
              l: DCCon.util.serialize(data.detail)
            })
          }
          getBlocked = !getBlocked
          document.getElementById('__hoverBox_blockBtn').innerHTML = getBlocked
            ? '차단 해제'
            : '차단'

          recalcOverlay(createdOverlay, ev)
        })
    }
  },

  network: {
    /**
     * 디시인사이드 API를 이용해 디시콘 정보를 받아옵니다.
     * @param {String} token ci_t 토큰
     * @param {String} con_id 디시콘 셋 ID
     * @param {String} con_code 디시콘 개별 ID (no=XXXXX)
     */
    fetch: async (token, con_id, con_code) => {
      let response = await fetch(
        'https://gall.dcinside.com/dccon/package_detail',
        {
          method: 'POST',
          dataType: 'json',
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          cache: 'no-store',
          body: `ci_t=${token}&package_idx=${con_id}&code=${con_code}`
        }
      )

      return await response.json()
    },

    getToken: async cookies => {
      let response = await fetch('https://dccon.dcinside.com/', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store'
      })

      let responseParse = await response.text()

      let domPs = new DOMParser().parseFromString(
        await response.text(),
        'text/html'
      )

      return responseParse
    },

    info: async (token, con_code) => {
      let response = await fetch('https://dccon.dcinside.com/index/get_info', {
        method: 'POST',
        dataType: 'json',
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        cache: 'no-store',
        body: `ci_t=${token}&code=${con_code}`
      })

      return await response.text()
    },

    buy: async (token, con_id) => {
      let response = await fetch('https://dccon.dcinside.com/index/buy', {
        method: 'POST',
        dataType: 'json',
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        cache: 'no-store',
        body: `ci_t=${token}&package_idx=${con_id}`
      })

      return await response.text()
    }
  }
}

/**
 * 새 글 알림 캐쉬에 추가하는 함수입니다.
 * @param {DocumentFragment} t 가져올 ID의 Document
 * @param {Boolean} Isinit 초기화 인가? (새로운 class 변경 없음)
 */

let addNewCaching = (t, Isinit) => {
  if (typeof t === 'undefined' || t == null) return
  var idNumbers = t.getElementsByClassName('gall_num')
  var __idn_l = idNumbers.length

  for (var i = 0; i < __idn_l; i++) {
    if (!Isinit && typeof cachedNew[idNumbers[i].innerText] === 'undefined') {
      idNumbers[i].classList.add('__dc_newPost')
    }
    cachedNew[idNumbers[i].innerText] = {}
  }
}

/**
 * IP 정보를 IP 뒤에 표시합니다.
 *
 * @param {DocumentFragment} t 가져올 ID의 Document
 */
let addIPInfo = t => {
  if (typeof t === 'undefined' || t == null) return

  let all_writter = t.querySelectorAll('.gall_writer')

  let writter_length = all_writter.length
  for (var i = 0; i < writter_length; i++) {
    let cur_writter = all_writter[i]
    if (!cur_writter.dataset.ip || cur_writter.dataset.ip == '') continue
    if (cur_writter.querySelector('span.__dcref_ip')) continue
    let ip_type = DCRefresher.object.ip[cur_writter.dataset.ip]
    if (!ip_type) continue

    let ip_text = DCRefresher.object.ip_lis[ip_type].text

    let cre_ipinfo = document.createElement('span')
    cre_ipinfo.innerText = ip_text
    cre_ipinfo.className = '__dcref_ip'
    cur_writter.appendChild(cre_ipinfo)
  }
}

/**
 * 유동을 숨깁니다.
 * @param {DocumentFragment} t 가져올 ID의 Document
 */
let removeNotLoginUser = t => {
  var all_writter = t.querySelectorAll('.gall_writer')

  let writter_length = all_writter.length
  for (var i = 0; i < writter_length; i++) {
    let cur_writter = all_writter[i]
    if (!cur_writter.dataset.ip || cur_writter.dataset.ip == '') continue
    cur_writter.parentElement.parentElement.removeChild(
      cur_writter.parentElement
    )
  }
}

/**
 * div의 가로 세로를 w, h 에 맞춰 정렬하는 함수입니다.
 * @param {HTMLElement} div top, bottom 등을 맞출 element
 * @param {Number} w 마우스 포인터의 x 값
 * @param {Number} h 마우스 포인터 y 값
 */
let recalcLeftRight = (div, w, h) => {
  var bnd_rect = div.getBoundingClientRect()

  if (centrePage) {
    div.style.left = window.innerWidth / 2 - bnd_rect.width / 2 + 'px'
    div.style.top = window.innerHeight / 2 - bnd_rect.height / 2 + 'px'
    return
  }

  if (h + bnd_rect.height > window.innerHeight) {
    div.style.bottom = window.innerHeight - h + 'px'
  } else {
    div.style.top = h + 'px'
  }

  if (w + bnd_rect.width > window.innerWidth) {
    div.style.right = window.innerWidth - w + 'px'
  } else {
    div.style.left = w + 'px'
  }
}

/**
 * 아이콘 URL을 파싱해 닉네임 종류를 알아냅니다.
 * @param {String} iconUrl 아이콘의 URL
 */
let iconParse = iconUrl => {
  if (/\/fix_nik\.gif/.test(iconUrl)) return 1
  if (/\/nik\.gif/.test(iconUrl)) return 2
  if (/\/sub_managernik\.gif/.test(iconUrl)) return 3
  if (/\/fix_sub_managernik\.gif/.test(iconUrl)) return 4
  if (/\/fix_managernik\.gif/.test(iconUrl)) return 5
  if (/\/dc20th_wgallcon2\.png/.test(iconUrl)) return 6 // 주딱 풍선 바이러스
  if (/\/dc20th_wgallcon3\.png/.test(iconUrl)) return 7 // 파딱 풍선 바이러스
  if (/\/dc20th_wgallcon\.png/.test(iconUrl)) return 8 // 반고닉 풍선 바이러스
  if (/\/dc20th_wgallcon4\.png/.test(iconUrl)) return 9 // 고닉 풍선 바이러스

  return 0
}

/**
 * HTML 데이터에서 유용한 데이터를 파싱하여 결과를 Object로 반환합니다.
 * @param {DocumentFragment} d 값 데이터 Document
 * @param {String} id 게시글 ID
 * @returns {Object} 도큐멘트에서 파싱한 값
 */
let getInfofromDocument = (d, id) => {
  let upvotes = d.getElementById('recommend_view_up_' + id).innerText
  let downvotes = d.getElementById('recommend_view_down_' + id).innerText
  let commentCounts = d.getElementById('comment_total_' + id).innerText
  let category = d.getElementsByClassName('title_headtext')[0].innerText
  let title = d.getElementsByClassName('title_subject')[0].innerText
  let __nick_obj = d.getElementsByClassName('gall_writer')[0]
  let nick = __nick_obj.dataset.nick
  let unique_id = __nick_obj.dataset.uid
  let ip_addr = __nick_obj.dataset.ip
  let date = d.getElementsByClassName('gall_date')[0].title

  let isManager =
    typeof d.getElementsByClassName('useradmin_go')[0] !== 'undefined'

  let __voteCodeParentElem = d.getElementsByClassName('recommend_kapcode')[0]
  let isCaptcha =
    __voteCodeParentElem != null && typeof __voteCodeParentElem !== 'undefined'

  let viewContent = d.getElementsByClassName('gallview_head')[0]
  let __nickCon = viewContent.getElementsByTagName('img')[0]
  let __nickTypeURL = typeof __nickCon !== 'undefined' ? __nickCon.src : ''
  let nickType = iconParse(__nickTypeURL)

  return {
    upvotes,
    downvotes,
    commentCounts,
    title,
    category,
    nick,
    unique_id,
    ip_addr,
    date,
    nickType,
    isCaptcha,
    isManager
  }
}

/**
 * 닉네임 Dom을 렌더링합니다.
 * @param {Object} postData 데이터 구조
 */
let renderNicks = postData => {
  let ip_obj = DCRefresher.object.ip[postData.ip_addr]
  let ip_inf = ip_obj ? ' (' + DCRefresher.object.ip_lis[ip_obj].text + ')' : ''

  return `<div class="__hoverBox_nickWrap">
  <span class="__hoverBox_nickIcon __hoverBox_icon${postData.nickType}"></span>
  <span class="__hoverBox_nickName">${postData.nick}</span>
  <span class="__hoverBox_nickId" title="해당 유저의 갤로그를 엽니다." onclick="window.open('https://gallog.dcinside.com/${
  postData.unique_id
}')">${postData.unique_id}</span>
  <span class="__hoverBox_nickIP">${postData.ip_addr}${ip_inf}</span>
  <span class="__hoverBox_date">${postData.date}</span>
</div>`
}

const recalcOverlay = (createdOverlay, ev) => {
  if (!centrePage) {
    recalcLeftRight(createdOverlay, ev.clientX - 5, ev.clientY - 5)
  } else {
    recalcLeftRight(
      createdOverlay,
      window.innerWidth / 2,
      window.innerHeight / 2
    )
  }
}

let commentsRender = (fetchedData, page, pgId, id, esno) => {
  var dcCrediv = document.createDocumentFragment()

  if (!fetchedData.comments) return [0, dcCrediv]
  for (var i = 0; i < fetchedData.comments.length; i++) {
    var c = fetchedData.comments[i]
    // 댓글돌이일 경우 건너 뜀
    if (c.nicktype === 'COMMENT_BOY') continue

    var getIcon = new DOMParser().parseFromString(c.gallog_icon, 'text/html')
    var imgElem = getIcon.getElementsByTagName('img')[0]

    var postData = {
      nick: c.name,
      unique_id: c.user_id,
      ip_addr: c.ip,
      date: c.reg_date,
      nickType: iconParse(imgElem ? imgElem.src : '')
    }

    var cs = document.createElement('div')
    cs.className = `__hoverBox_commentWraps ${
      c.is_delete > 0 ? '__hoverBox_deletedCmt ' : ''
    }__hoverBox_pushLeft${c.depth}`
    cs.innerHTML = renderNicks(postData)

    var commentContent = document.createElement('div')
    commentContent.className = '__hoverBox_commentContent'

    var getIcon = new DOMParser().parseFromString(c.memo, 'text/html')
    var checkDcCon = getIcon.getElementsByTagName('img')

    if (checkDcCon[0]) {
      var dcConElem
      if (DCCon.block.check(checkDcCon[0].src)) {
        dcConElem = createBlockedDCConText(checkDcCon[0].src)
      } else {
        var dcConElem = document.createElement('img')
        dcConElem.src = checkDcCon[0].src
        dcConElem.className = '__hoverBox_dccon __hoverBox_dcconLoading'
        DCCon.popup.handler(dcConElem, checkDcCon[0].src)

        dcConElem.onload = () => {
          dcConElem.classList.remove('__hoverBox_dcconLoading')
        }
      }

      commentContent.appendChild(dcConElem)
    } else if (c.vr_player) {
      var dcAudio = document.createElement('audio')
      dcAudio.controls = true
      dcAudio.src =
        'https://vr.dcinside.com/' + c.memo.replace(/\@\^dc\^\@/g, '')
      commentContent.appendChild(dcAudio)
    } else {
      commentContent.innerHTML = c.memo
    }

    cs.appendChild(commentContent)

    dcCrediv.appendChild(cs)
  }

  if (fetchedData.total_cnt >= 100) {
    var pagination = document.createElement('div')
    pagination.className = '__hoverBox_pageNCollect'
    var page = Math.ceil(fetchedData.total_cnt / 100)

    for (var i = 1; i < page + 1; i++) {
      var clickBtn = document.createElement('div')
      clickBtn.innerHTML = i
      clickBtn.className = `__hoverBox_frPage${
        i == page ? ' __hoverBox_frCurPage' : ''
      }`
      clickBtn.dataset.cmtp = i

      pagination.appendChild(clickBtn)
    }

    dcCrediv.appendChild(pagination)
  }

  return [fetchedData.total_cnt, dcCrediv]
}

/**
 * 디시 서버에 개념글 추천 요청을 보냅니다.
 *
 * @param {Boolean} is_up 개념글 추천 버튼인가?
 * @param {String} gall_id 갤러리 ID
 * @param {String} post_id 게시글 ID
 */
let pressRecommend = async (is_up, gall_id, post_id, code) => {
  try {
    set_cookie_tmp(
      gall_id + post_id + '_Firstcheck' + (!is_up ? '_down' : ''),
      'Y',
      3,
      'dcinside.com'
    )

    let response = await fetch(
      'https://gall.dcinside.com/board/recommend/vote',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          DNT: 1
        },
        cache: 'no-store',
        body: `ci_t=${getCookie('ci_c')}&id=${gall_id}&no=${post_id}&mode=${
          is_up ? 'U' : 'D'
        }&code_recommend=${code}`
      }
    )

    let txt = response.text()
    return txt
  } catch (e) {
    if (e) return false
  }
}

/**
 * 마갤 주딱 / 파딱 전용 게시글 지우기 기능
 * @param {*} gall_id 갤러리 ID
 * @param {*} post_no 게시글 번호
 */
let deletePost = async (gall_id, post_no) => {
  try {
    let serverResponse = await fetch(
      'https://gall.dcinside.com/ajax/minor_manager_board_ajax/delete_list',
      {
        method: 'POST',
        dataType: 'json',
        mode: 'cors',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          DNT: 1
        },
        cache: 'no-store',
        body: `ci_t=${getCookie('ci_c')}&id=${gall_id}&nos[]=${Number(
          post_no
        )}`
      }
    )

    return serverResponse.json()
  } catch (e) {
    if (e) return false
  }
}

/**
 * DC인사이드 쿠키 저장 스크립트
 * @param {String} cname
 * @param {String} cvalue
 * @param {Number} exdays
 * @param {String} domain
 */
var setCookie = function (cname, cvalue, exdays, domain) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie =
    cname + '=' + cvalue + ';' + expires + ';path=/;domain=' + domain
}

function set_cookie_tmp (e, t, o, i) {
  var n = new Date()
  n.setTime(n.getTime() + 36e5 * o),
  (document.cookie =
      e +
      '=' +
      escape(t) +
      '; path=/; domain=' +
      i +
      '; expires=' +
      n.toGMTString() +
      ';')
}

/**
 * 디시인사이드에서 Captcha 코드를 받아옵니다.
 * @param {String} type 캡챠 요청 종류
 * @param {String} token csrf 토큰
 * @param {String} gall_id 갤러리 ID
 */
let getCaptcha = async (type, token, gall_id) => {
  let response = await fetch('https://gall.dcinside.com/kcaptcha/session', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    cache: 'no-store',
    body: `ci_t=${token}&gall_id=${gall_id}&kcaptcha_type=${type}`
  })

  return [
    `https://gall.dcinside.com/kcaptcha/image/?kcaptcha_type=${type}&time=${new Date().getTime()}`,
    String(await response.text()).trim()
  ]
}

let getCommentsAsHTML = async (div, pgId, id, esno, cmtPage) => {
  var ftchCmts = await fetchComments(pgId, id, esno, cmtPage)
  var renderedComments = await commentsRender(ftchCmts, cmtPage, pgId, id, esno)

  var findCommentPage = renderedComments[1].querySelectorAll('[data-cmtp]')

  findCommentPage.forEach(cmtNav => {
    ;(r => {
      cmtNav.addEventListener('click', async () => {
        r.innerHTML = ''
        r.appendChild(
          await getCommentsAsHTML(r, pgId, id, esno, cmtNav.dataset.cmtp)
        )
      })
    })(div)
  })

  return renderedComments[1]
}

/**
 * 디시인사이드 API를 이용해 댓글을 받아옵니다.
 * @param {String} gall_id 갤러리 ID
 * @param {String} post_id 게시글 ID
 * @param {String} esno ESNO csrf_token
 */
let fetchComments = async (gall_id, post_id, esno, page) => {
  let response = await fetch('https://gall.dcinside.com/board/comment/', {
    method: 'POST',
    dataType: 'json',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    cache: 'no-store',
    referrer: `https://gall.dcinside.com/${
      isMinor ? 'mgallery/' : ''
    }board/view/?id=${gall_id}&no=${post_id}&page=${pgNum}`,
    body: `id=${gall_id}&no=${post_id}&cmt_id=${gall_id}&cmt_no=${post_id}&e_s_n_o=${esno}&comment_page=${page ||
      1}&sort=`
  })

  return await response.json()
}

/**
 * 디시인사이드 페이지에 GET 요청을 보내 게시글을 가져옵니다.
 * @param {HTMLElement} div 가져온 값을 적용할 HTMLElement
 * @param {String} id 게시글의 ID값
 */
let fetchPostInfo = async (div, id) => {
  let response = await fetch(
    'https://gall.dcinside.com/' +
      (isMinor ? 'mgallery/' : '') +
      'board/view/' +
      window.location.search +
      '&no=' +
      id,
    { method: 'GET', mode: 'cors', cache: 'no-store' }
  )

  let domPs = new DOMParser().parseFromString(
    await response.text(),
    'text/html'
  )

  let postData = getInfofromDocument(domPs, id)
  let cntWrap = document.createElement('div')
  cntWrap.className = '__hoverBox_contentWrap'

  var headers = document.createElement('div')
  headers.className = '__hoverBox_header'
  headers.innerHTML = `
    <span class="__hoverBox_postTitle">${postData.title}</span>
    ${renderNicks(postData)}
  `
  cntWrap.appendChild(headers)

  let fetchedWrittingBox = domPs.getElementsByClassName('writing_view_box')

  if (fetchedWrittingBox[0].innerHTML.indexOf('dccon') != -1) {
    addContentFilter(domPs)
  }

  fetchedWrittingBox[0].style.float = 'unset'
  fetchedWrittingBox[0].style.maxWidth = 'unset'
  fetchedWrittingBox[0].style.width = '100%'
  cntWrap.appendChild(fetchedWrittingBox[0])

  var captchaImg = await getCaptcha('recommend', getCookie('ci_c'), pgId)

  var bottomContents = document.createElement('div')
  bottomContents.className = '__hoverBox_bottom'
  bottomContents.innerHTML = `
    ${
  postData.isCaptcha
    ? `
      <div class="__hoverBox_voteCodeWrap">
        <img id="__hoverBox_captchaImg"src="${captchaImg[0]}"></img>
        <input type="text" id="__hoverBox_voteCodeTexts"></input>
      </div>
    `
    : '<input class="__hoverBox_nosee" type="text" id="__hoverBox_voteCodeTexts"></input>'
}
    <div class="__hoverBox_voteWrap">
      <div class="__hoverBox_upvoteWrap" id="__hoverBox_upvoteId_${id}">
        <img src="${chrome.extension.getURL(
    '/icns/upvote.png'
  )}" class="__hoverBox_voteIcon"></img>
        <div class="__hoverBox_btnCountsText" id="__hoverBox_upvoteBtn">${
  postData.upvotes
}</div>
      </div>
      <div class="__hoverBox_downvoteWrap" id="__hoverBox_downvoteId_${id}">
        <img src="${chrome.extension.getURL(
    '/icns/downvote.png'
  )}" class="__hoverBox_voteIcon"></img>
        <div class="__hoverBox_btnCountsText" id="__hoverBox_downvoteBtn">${
  postData.downvotes
}</div>
      </div>
      ${
  postData.isManager
    ? `
      <div class="__hoverBox_manageDelete" id="__hoverBox_manageDeleteBtn">
      <img src="${chrome.extension.getURL(
    '/icns/delete.png'
  )}" class="__hoverBox_voteIcon"></img>
      </div>`
    : ``
}
    </div>
    <div class="__hoverBox_seperater"></div>
  `

  var bottomComments = document.createElement('div')
  bottomComments.id = '__hoverBox_commentBox'
  bottomComments.className = '__hoverBox_comment'
  bottomComments.append(
    await getCommentsAsHTML(
      bottomComments,
      pgId,
      id,
      domPs.getElementById('e_s_n_o').value,
      1
    )
  )
  cntWrap.appendChild(bottomContents)
  cntWrap.appendChild(bottomComments)
  div.innerHTML = ''
  div.appendChild(cntWrap)

  var upvoteBtn = document.getElementById('__hoverBox_upvoteId_' + id)
  upvoteBtn.addEventListener('click', async () => {
    var res = await pressRecommend(
      true,
      pgId,
      id,
      document.getElementById('__hoverBox_voteCodeTexts').value
    )
    var splds = res.replace(/\|\|/g, '|').split('|')

    if (splds[0] == 'true' && splds[1] != '') {
      document.getElementById('__hoverBox_upvoteBtn').innerText = splds[1]
      return
    }

    if (!res || splds[0] != 'true') {
      DCRefresher.util.shake(upvoteBtn)
    }
  })

  var downvoteBtn = document.getElementById('__hoverBox_downvoteId_' + id)
  downvoteBtn.addEventListener('click', async () => {
    var res = await pressRecommend(
      false,
      pgId,
      id,
      document.getElementById('__hoverBox_voteCodeTexts').value
    )
    var splds = res.replace(/\|\|/g, '|').split('|')

    if (splds[0] == 'true' && splds[1] != '') {
      document.getElementById('__hoverBox_downvoteBtn').innerText = splds[1]
      return
    }

    if (!res || splds[0] != 'true') {
      DCRefresher.util.shake(downvoteBtn)
    }
  })

  var deleteBtn = document.getElementById('__hoverBox_manageDeleteBtn')

  if (typeof deleteBtn !== 'undefined' && deleteBtn != null) {
    deleteBtn.addEventListener('click', async () => {
      var res = await deletePost(pgId, id)

      if (res && res.result === 'success') {
        outerTooltip.style.opacity = 0
        div.style.opacity = 0
        setTimeout(() => {
          destroyTooltipOverlay(div, div.dataset.postid)
          outerTooltip.parentNode.removeChild(outerTooltip)
        }, 300)
      }

      if (!res || res.result == 'fail') {
        DCRefresher.util.shake(deleteBtn)
      }
    })
  }
}

/**
 * 오류 페이지 템플릿 만들기
 * @param {HTMLElement} div 적용할 div
 * @param {String} msg
 */
let renderErrorPage = (div, msg) => {
  div.innerHTML = `<div class="__hoverBox_error">
  <h3 class="__hoverBox_errTitle">오류 발생</h3>
  <p>글을 받아와 파싱하려는 도중 오류가 발생 하였습니다.</p>
  <br>
  <p class="__hoverBox_muteText">${msg}</p>
  </div>`
}

/**
 * 오른쪽 클릭시 오버레이 생성
 * @param {DocumentFragment} t 파싱된 게시판 HTML 소스
 */
let addHoverListener = t => {
  if (typeof t === 'undefined' || t == null) return

  var postBox = t.getElementsByClassName('ub-content')

  for (var z = 0; z < postBox.length; z++) {
    var postId = postBox[z].getElementsByClassName('gall_num')[0].innerHTML
    if (isNaN(postId)) {
      postId = getParameterByName(
        'no',
        postBox[z].getElementsByTagName('a')[0].href
      )
    }

    var createdOverlay = null
    ;(function (e, postId) {
      // 컨텐츠 박스 오른쪽 클릭시
      e.addEventListener('contextmenu', async ev => {
        ev.preventDefault()

        createdOverlay = await createTooltipOverlay(postId)
        createOuterOverlay(createdOverlay)
        fillWithLoader(createdOverlay)
        if (!centrePage) {
          recalcLeftRight(createdOverlay, ev.clientX - 5, ev.clientY - 5)
        } else {
          recalcLeftRight(
            createdOverlay,
            window.innerWidth / 2,
            window.innerHeight / 2
          )
        }

        try {
          await fetchPostInfo(createdOverlay, postId)
        } catch (e) {
          renderErrorPage(createdOverlay, e.message)
          console.log(e)
        }
        recalcLeftRight(createdOverlay, ev.clientX - 5, ev.clientY - 5)

        return ev.preventDefault()
      })
    })(postBox[z], postId)
  }
}

/**
 * 로딩 중인 경우, 로더로 채웁니다.
 * @param {HTMLElement} div
 */
let fillWithLoader = div => {
  div.innerHTML = ''
  var outerLoader = document.createElement('div')
  outerLoader.className = '__hoverBox_loader'

  var loaderRing = document.createElement('div')
  loaderRing.className = '__hoverBox_dual-ring'

  outerLoader.appendChild(loaderRing)
  div.appendChild(outerLoader)
}

let refFromObj = (org, lists_oValues) => {
  if (findSeperate.test(lists_oValues)) {
    let splitValues = lists_oValues.split('||')
    let splLen = splitValues.length
    for (var d = 0; d < splLen; d++) {
      if (org != '' && org.indexOf(splitValues[d]) != -1) {
        return true
      }
    }

    return false
  }

  return org != '' && org.indexOf(lists_oValues) != -1
}

let findSeperate = /\|\|/g

let hideBlockUsersPosts = table => {
  let fntUsers = table.getElementsByClassName('gall_writer')
  let blockedObjs = localStorage.getItem('block_all')
  blockedObjs =
    typeof blockedObjs !== 'object' ? JSON.parse(blockedObjs) : blockedObjs

  for (var i = 0; i < fntUsers.length; i++) {
    var dSet = fntUsers[i].dataset
    if (
      blockedObjs == null ||
      typeof blockedObjs.on === 'undefined' ||
      !blockedObjs.on
    ) {
      break
    }

    var IpBlocked =
      blockedObjs.ip == null || blockedObjs.ip == ''
        ? false
        : refFromObj(dSet.ip, blockedObjs.ip)
    var NickBlocked =
      blockedObjs.nick == null || blockedObjs.nick == ''
        ? false
        : refFromObj(dSet.nick, blockedObjs.nick)
    var IDBlocked =
      blockedObjs.id == null || blockedObjs.id == ''
        ? false
        : refFromObj(dSet.id, blockedObjs.id)

    if (IpBlocked || NickBlocked || IDBlocked) {
      fntUsers[i].parentNode.classList.add('__dcRef_blockedPosts')
    }
  }

  return table
}

let addSelectButtonWanjang = table => {
  let found_data = table.querySelectorAll('.ub-content')

  let colgroup = table.querySelector('colgroup')
  let col_s = document.createElement('col')
  col_s.style.width = '3%'
  colgroup.insertBefore(col_s, colgroup.childNodes[0])

  let thr_get = table.querySelector('thead tr')
  let thscope = document.createElement('th')
  thscope.className = 'chkbox_th'
  thscope.setAttribute('scope', 'col')
  thscope.innerHTML = `<span class="checkbox"><input type="checkbox" id="comment_chk_all" onclick="article_chk_all(this)"><em class="checkmark"></em><label for="comment_chk_all" class="blind">전체 글 선택</label></span>`
  thr_get.insertBefore(thscope, thr_get.childNodes[0])

  for (var i = 0; i < found_data.length; i++) {
    if (found_data[i].querySelector('.gall_chk')) continue

    let dom_create = document.createElement('td')
    dom_create.className = 'gall_chk'
    dom_create.innerHTML =
      '<span class="checkbox"><input type="checkbox" name="chk_article[]" class="list_chkbox article_chkbox"><em class="checkmark"></em><label class="blind">글 선택</label></span>'
    found_data[i].insertBefore(dom_create, found_data[i].childNodes[0])
  }

  return table
}

/**
 * 툴팁 오버레이 구조를 만들고 body에 append 합니다.
 * @param {String} id 게시글 ID
 */

let createTooltipOverlay = async (id, dc_con) => {
  var div = document.createElement('div')
  div.id = '__hoverBox' + (dc_con ? '_dccon_' : '_') + 'num_' + id
  div.className =
    '__hoverBox' +
    (dc_con ? '_dccon_' : '_') +
    'wrap ' +
    (darkMode ? '__dark ' : '')
  div.dataset.id = id

  document.getElementsByTagName('body')[0].appendChild(div)
  return div
}

/**
 * 오버레이를 제거합니다.
 * @param {HTMLElement} e 제거할 element
 */
let destroyTooltipOverlay = e => e.parentNode.removeChild(e)

/**
 * 오버레이 밖을 덮을 반투명한 검은 창을 만듭니다.
 * @param {HTMLElement} inner 오버레이 element
 */
let createOuterOverlay = inner => {
  outerTooltip = document.createElement('div')
  outerTooltip.className = '__hoverBox_outer'
  outerTooltip.id = '__hoverBox_outerId'

  document.getElementsByTagName('body')[0].append(outerTooltip)
  ;(function (inner, outer) {
    outer.addEventListener('click', () => {
      outer.style.opacity = 0
      inner.style.opacity = 0
      setTimeout(() => {
        destroyTooltipOverlay(inner)
        outer.parentNode.removeChild(outer)
      }, 300)
    })
  })(inner, outerTooltip)

  setTimeout(() => {
    outerTooltip.style.opacity = 1
  }, 1)
  return outerTooltip
}

/**
 * 디시콘 오버레이 밖을 덮을 반투명한 검은 창을 만듭니다.
 * @param {HTMLElement} inner 오버레이 element
 */
let createOuterDCOverlay = inner => {
  Con_outerTooltip = document.createElement('div')
  Con_outerTooltip.className = '__hoverBox_dccon_outer'
  Con_outerTooltip.id = '__hoverBox_DCCon_outerId'

  document.getElementsByTagName('body')[0].append(Con_outerTooltip)
  ;(function (inner, outer) {
    outer.addEventListener('click', () => {
      outer.style.opacity = 0
      inner.style.opacity = 0
      setTimeout(() => {
        destroyTooltipOverlay(inner)
        outer.parentNode.removeChild(outer)
      }, 300)
    })
  })(inner, Con_outerTooltip)

  setTimeout(() => {
    Con_outerTooltip.style.opacity = 1
  }, 1)
  return Con_outerTooltip
}

const addContentFilter = elem => {
  var getAllDCCon = elem.querySelectorAll('img.written_dccon')
  replaceBlockedDCCon(getAllDCCon)

  var getAllTexts = elem.querySelectorAll('div.writing_view_box p')
  replaceURLtoAHREF(getAllTexts)

  getAllDCCon.forEach(v => {
    DCCon.popup.handler(v, v.src)
  })
}

const createBlockedDCConText = origin => {
  var r = document.createElement('p')
  r.className = '__hoverBox_dcconBlocked'
  r.innerHTML = '차단된 디시콘입니다.'

  DCCon.popup.handler(r, origin)
  return r
}

/**
 * 게시글 안에서 차단된 DC콘을 제거합니다.
 *
 * @param {HTMLElement} arr HTML 컨텐츠
 */
const replaceBlockedDCCon = arr => {
  arr.forEach(e => {
    if (DCCon.block.check(e.src)) {
      var repl = createBlockedDCConText(e.src)
      e.parentNode.replaceChild(repl, e)
    }
  })
}

const blockedServices = ['drive.구글.com', '비틀리']
const blockedServicesReplace = ['drive.google.com', 'bitly']
const replaceGoogleText = t => {
  var rd = t
  blockedServices.forEach((v, i) => {
    var tIndex = t.indexOf(v)

    if (tIndex != -1) {
      rd = t.replace(v, blockedServicesReplace[i])
    }
  })

  return rd
}

// from https://www.regextester.com/94502
const urlCheckRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
const urlSchemeRegex = /^(http|https|ftps):\/\//g
/**
 * 게시글 안에 있는 a href 처리되지 않은 텍스트를 a href 로 변환합니다.
 * @param {*} arr
 */
const replaceURLtoAHREF = arr => {
  arr.forEach(e => {
    if (
      urlCheckRegex.test(e.innerText) &&
      e.innerHTML.indexOf('<a href') == -1
    ) {
      var splitE = e.innerHTML.split(' ')

      var finalized = []
      splitE.forEach(v => {
        if (urlCheckRegex.test(v)) {
          v = replaceGoogleText(v)

          v =
            '<a class="__hoverBox_aLink" href="' +
            ((v.substring(0, 4) != 'http' ? 'https://' : '') + v) +
            '"> ' +
            v.trim() +
            ' </a>'
        }
        finalized.push(v)
      })

      var domText = document.createElement('p')
      domText.innerHTML = finalized.join(' ')
      e.parentNode.replaceChild(domText, e)
    }

    if (e.firstChild) {
      var cNodes = e.childNodes

      cNodes.forEach(v => {
        if (
          typeof v.tagName !== 'undefined' &&
          v.tagName.toLowerCase() == 'a' &&
          !Array.from(v.childNodes).some(
            d => (d.tagName || 'null').toLowerCase() == 'img'
          )
        ) {
          v.className += ' __hoverBox_aLink'
        }
      })
    }
  })
}

const listRegex = /\/board\/lists/g
const viewRegex = /\/board\/view/g

/**
 * DOMContentLoaded : 페이지 HTML 로드 완료
 */
window.addEventListener('DOMContentLoaded', () => {
  // 폰트 교체 -> Noto Sans CJK KR
  let gElements = document.getElementsByClassName('dcwrap')
  for (let i = 0, l = gElements.length; i < l; i++) {
    gElements[i].style.fontFamily = "'Noto Sans CJK KR', sans-serif"
  }

  setCookie('_gat_mgall_web', 1, 3, 'dcinside.com')

  var testList = listRegex.test(window.location.href)
  var testView = viewRegex.test(window.location.href)

  if (testList || testView) {
    gTableOrigin = document.getElementsByClassName('gall_list')[0]
  }

  gTableOrigin = hideBlockUsersPosts(gTableOrigin)
  if (blockNotLogin) {
    removeNotLoginUser(gTableOrigin)
  } else {
    addIPInfo(gTableOrigin)
  }
  addNewCaching(gTableOrigin, true)
  addHoverListener(gTableOrigin)

  if (testView) {
    addContentFilter(document)
  }

  if ((testView || testList) && pgId != null) {
    if (refreshRate < 2000) refreshRate = 2000
    setInterval(
      () => {
        if (!window.navigator.onLine || document.hidden) return false

        let select_btn = document.querySelectorAll(
          'input[name="chk_article[]"]:checked'
        )

        if (select_btn && select_btn.length) {
          return false
        }

        if (document.querySelector('#user_data_lyr')) {
          return false
        }

        try {
          fetch(fetchURL, {
            method: 'GET',
            mode: 'cors'
          }).then(async response => {
            let domPs = new DOMParser().parseFromString(
              await response.text(),
              'text/html'
            )

            let gTable = domPs.getElementsByClassName('gall_list')[0]
            gTable = hideBlockUsersPosts(gTable)
            if (document.querySelector('.useradmin_btnbox')) {
              gTable = addSelectButtonWanjang(gTable)
            }

            if (blockNotLogin) {
              removeNotLoginUser(gTable)
            } else {
              addIPInfo(gTable)
            }

            addNewCaching(gTable, false)
            gTableOrigin.innerHTML = ''
            gTableOrigin.append(gTable)
            addHoverListener(gTableOrigin)
          })
        } catch (e) {
          return false
        }
      },
      isNaN(refreshRate) ? 5000 : refreshRate
    )
  }
})
