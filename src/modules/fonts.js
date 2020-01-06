;(() => {
  let MODULE = {
    name: '폰트 교체',
    description: '글 목록에 표시되는 폰트를 교체합니다.',
    author: 'Sochiru',
    status: false,
    memory: {},
    enable: true,
    default_enable: true,
    func: filter => {
      let cb = scope => {
        let q = [...scope.querySelectorAll('.wrap_inner, .gall_list thead, .gall_list tbody')]
        let qIter = q.length

        while (qIter--) {
          if (q[qIter].className.indexOf('refresherFont') == -1) {
            q[qIter].className += ' refresherFont'
          }
        }
      }

      MODULE.memory.uuid = filter.add(cb)

      console.log(this.memory)
    }
  }

  module.exports = MODULE
})()
