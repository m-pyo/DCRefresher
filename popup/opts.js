const opts_db = {
  centre_page: [false, 'checkbox'],
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

document.addEventListener('DOMContentLoaded', () => {
  ref_opts()
})
