;(() => {
  const make = () => {
    if (!document || !document.createElement) {
      throw new Error('make function can\'t run before DOMContentLoaded')
    }

    let frame = document.createElement('refresher-frame')

    return frame
  }

  module.exports = {
    make
  }
})()