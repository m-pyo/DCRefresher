const urls = {
  base: 'https://gall.dcinside.com/',
  manage: {
    delete:
      'https://gall.dcinside.com/ajax/minor_manager_board_ajax/delete_list'
  },
  comments: 'https://gall.dcinside.com/board/comment/',
  dccon: {
    detail: 'https://gall.dcinside.com/dccon/package_detail',
    info: 'https://dccon.dcinside.com/index/get_info',
    buy: 'https://dccon.dcinside.com/index/buy'
  }
}

const heads = {
  'X-Requested-With': 'XMLHttpRequest'
}

const make = (url, options) =>
  new Promise((resolve, reject) =>
    fetch(url, options).then(async response => {
      if (response.status && response.status > 400) {
        reject(response.statusText)
      }

      let body = await response.text()

      if (body.substring(0, 1) === '{') {
        body = JSON.parse(body)
      }

      resolve(body)
    })
  )

module.exports = {
  make,
  urls,
  heads
}
