const str = (window.chrome && window.chrome.storage) || storage

const set = (key, value) => {
  if (!str) {
    throw new Error("This browser doesn't support storage API.")
  }

  let obj = {}
  obj[key] = value

  return str.sync.set(obj, () => {
    
  })
}

const get = key => {
  if (!str) {
    throw new Error("This browser doesn't support storage API.")
  }

  return new Promise((resolve, reject) => str.sync.get(key, v => resolve(v)))
}

module.exports = {
  set,
  get
}
