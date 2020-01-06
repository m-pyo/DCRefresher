;(() => {
  let MODULE = {
    name: '광고 차단',
    description: '글 목록에 뜨는 광고 및 게시글 내의 광고를 차단합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    func: (filter) => {
      let cb = scope => {
        let q = [...scope.querySelectorAll('.stickyunit, .rightbanner, .trc_related_container')]
        let qIter = q.length

        while (qIter--) {
          q[qIter].parentElement.removeChild(q[qIter])
        }
      }

      MODULE.memory.uuid = filter.add(cb)

      filter.on(MODULE.memory.uuid, 'remove', () => {
        console.log('removing')
      })
    }
  }

  module.exports = MODULE
})()
