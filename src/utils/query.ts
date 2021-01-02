export default (name: string) =>
  new URLSearchParams(window.location.search).get(name)
