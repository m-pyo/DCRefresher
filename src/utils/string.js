;(() => {
  const _ = {
    rand: () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },

    uuid: () => {
      return _.rand() + _.rand() + '-' + _.rand() + '-' + _.rand() + '-' + _.rand() + '-' + _.rand() + _.rand() +_.rand()
    }
  }

  module.exports = _
})()
