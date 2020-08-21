const ip = require('../utils/ip')

const USERTYPE = {
  UNFIXED: 0,
  HALFFIXED: 1,
  FIXED: 2,
  SUBMANAGER: 3,
  MANAGER: 4
}
module.exports = class User {
  constructor (nick, id, ip, icon) {
    this.nick = nick
    this.id = id
    this.ip = ip

    this.icon = icon
    this.type = this.getType(icon)
  }

  getType (icon) {
    if (!icon || icon === null) {
      return USERTYPE.UNFIXED
    } else if (
      icon.indexOf('/fix_nik.gif') > -1 ||
      icon.indexOf('/dc20th_wgallcon4.') > -1
    ) {
      return USERTYPE.FIXED
    } else if (
      icon.indexOf('/nik.gif') > -1 ||
      icon.indexOf('/dc20th_wgallcon.') > -1
    ) {
      return USERTYPE.HALFFIXED
    } else if (
      icon.indexOf('sub_manager') > -1 ||
      icon.indexOf('/dc20th_wgallcon3.') > -1
    ) {
      return USERTYPE.SUBMANAGER
    } else if (
      icon.indexOf('manager') > -1 ||
      icon.indexOf('/dc20th_wgallcon2.') > -1
    ) {
      return USERTYPE.MANAGER
    }
  }

  import (dom) {
    let nick = dom.dataset.nick || null
    let uid = dom.dataset.uid || null
    let ip = dom.dataset.ip || null

    let icon =
      uid !== null ? dom.querySelector('a.writer_nikcon img').src : null

    this.nick = nick
    this.id = uid
    this.ip = ip
    this.icon = icon

    this.type = this.getType(icon)

    return this
  }

  isLogout () {
    return this.ip !== null
  }

  isMember () {
    return this.id !== null
  }

  set ip (v) {
    this.ip_data = ip.ISPString(v)
    this.__ip = v
  }

  get ip () {
    return this.__ip
  }
}
