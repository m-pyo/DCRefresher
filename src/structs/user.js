module.exports = class User {
  constructor (nick, id, ip, icon) {
    this.nick = nick
    this.id = id
    this.ip = ip

    this.icon = icon
  }

  import (dom) {
    let nick = dom.dataset.nick || null
    let uid = dom.dataset.uid || null
    let ip = dom.dataset.ip || null

    let icon = uid !== null ? dom.querySelector('a.writer_nikcon img').src : null

    this.nick = nick
    this.id = uid
    this.ip = ip
    this.icon = icon

    return this
  }

  isLogout () {
    return this.ip !== null
  }

  isMember () {
    return this.id !== null
  }
}
