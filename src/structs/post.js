module.exports = class PostInfo {
  constructor (id, data) {
    this.id = id

    let keys = Object.keys(data)
    for (var i = 0; i < keys.length; i ++) {
      let key = keys[i]

      this[key] = data[key]
    }
  }
}