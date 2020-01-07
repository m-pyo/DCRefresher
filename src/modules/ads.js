;(() => {
  let MODULE = {
    name: '광고 차단',
    description: '글 목록에 뜨는 광고 및 게시글 내의 광고를 차단합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    func: filter => {
      MODULE.memory.uuid = filter.add(
        '.stickyunit, .rightbanner, .trc_rbox, .trc_related_container, .trc_rbox_container, #zzbang_ad, .trc_rbox_container, #ad_floating',
        elem => {
          elem.parentElement.removeChild(elem)
        }
      )
    }
  }

  module.exports = MODULE
})()
