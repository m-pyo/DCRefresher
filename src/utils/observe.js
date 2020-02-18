const observe = {
  find: (elem, parent) =>
    new Promise((resolve, reject) => {
      let parentFind = parent.querySelectorAll(elem)
      if (parentFind.length) {
        resolve(parentFind)
      }

      var observer = new MutationObserver(muts => {
        let executed = false
        let mutIter = muts.length
        while (mutIter--) {
          if (executed) break
          executed = muts[mutIter].addedNodes.length
        }

        if (!executed) return
        let lists = document.querySelectorAll(elem)
        if (!lists.length) return

        observer.disconnect()
        resolve(lists)
      })

      observer.observe(document.documentElement, {
        childList: true
      })

      document.addEventListener('load', () => {
        if (!observer) return
        observer.disconnect()
        reject('Too long execution.')
      })
    })
}

module.exports = observe
