const opts_db = {
  centre_page: [true, 'checkbox'],
  dark_mode: [false, 'checkbox'],
  refresh_rate: [5000, 'text']
}

/**
 * 옵션을 크롬 Sync API를 사용해 저장합니다.
 * @param {String} key 저장할 값의 key ID
 * @param {String} value 저장할 값
 */
const save_opt = (key, value) => {
  var d = {}
  d[key] = value

  return chrome.storage.sync.set(d, () => {})
}

/**
 * 옵션을 크롬 Sync API를 사용해 저장합니다.
 * @param {String} key 불러올 값의 key ID
 */
const get_opt = async key => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(key, i => {
        resolve(i[key])
      })
    } catch (e) {
      reject(e)
    }
  })
}

const ref_opts = async () => {
  let objV = Object.keys(opts_db)

  for (var i = 0; i < objV.length; i++) {
    var e = objV[i]
    var gort = await get_opt(e)

    if (!gort) {
      await save_opt(e, opts_db[e][0])
    }

    document.getElementById(e)[
      opts_db[e][1] == 'checkbox' ? 'checked' : 'value'
    ] = await get_opt(e)
    ;(e => {
      document
        .getElementById(e)
        .addEventListener(
          opts_db[e][1] === 'checkbox' ? 'click' : 'change',
          () => {
            save_opt(
              e,
              document.getElementById(e)[
                opts_db[e][1] === 'checkbox' ? 'checked' : 'value'
              ]
            )
          }
        )
    })(e)
  }
}

const renderBlocked = async () => {
  var outputElem = document.getElementById('manage_blocked')
  var lists = await get_opt('blocked_dccon')
  var errorOccured = false

  try {
    lists = JSON.parse(lists)
  } catch (e) {
    errorOccured = true
  }

  outputElem.innerHTML = ''

  if (errorOccured || lists == null || lists.length < 1) {
    outputElem.innerHTML = '<p>차단된 디시콘이 없습니다.</p>'
    return
  }

  let arrObj = Object.keys(lists)

  arrObj.forEach((v, i) => {
    var blockedObj = lists[v]

    if (!blockedObj.n) return

    var rootBlocked = document.createElement('div')
    rootBlocked.className = 'opts_blcked_done'

    var blockedConTitle = document.createElement('p')
    blockedConTitle.className = 'opts_blcked_title'
    blockedConTitle.innerHTML = blockedObj.n

    var blockedConSeller = document.createElement('p')
    blockedConSeller.className = 'opts_blcked_seller'
    blockedConSeller.innerHTML = blockedObj.s

    var blockedConRemoveBtn = document.createElement('div')
    blockedConRemoveBtn.className = 'opts_blcked_delete'
    blockedConRemoveBtn.innerHTML = `<img src="${chrome.extension.getURL(
      '/icns/delete.png'
    )}">`

    blockedConRemoveBtn.onclick = () => {
      delete lists[v]
      save_opt('blocked_dccon', JSON.stringify(lists))
      renderBlocked()
    }

    rootBlocked.appendChild(blockedConTitle)
    rootBlocked.appendChild(blockedConSeller)
    rootBlocked.appendChild(blockedConRemoveBtn)
    outputElem.appendChild(rootBlocked)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  ref_opts()
  renderBlocked()
})
