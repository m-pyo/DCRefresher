const storage = window['localStorage']

const set = (key, value) => {
  if (!storage) {
    throw new Error("This browser doesn't support storage API.")
  }

  return storage.setItem(key, value)
}

const get = key => {
  if (!storage) {
    throw new Error("This browser doesn't support storage API.")
  }

  return storage.getItem(key)
}

const reset = () => {
  if (!storage) {
    throw new Error("This browser doesn't support storage API.")
  }

  storage.clear()
}

module.exports = {
  set,
  get,
  reset
}
