module.exports = name => {
  return new URLSearchParams(window.location.search).get(name)
}
