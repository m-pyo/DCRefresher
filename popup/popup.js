const openLink = l => window.open(l)

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('desc').onclick = () => {
    openLink('https://sochiru.pw')
  }
  document.getElementById('desc_github').onclick = () => {
    openLink('https://github.com/So-chiru/DCRefresher')
  }
  document.getElementById('open_option').onclick = () => {
    chrome.runtime.openOptionsPage()
  }
})
