const observe = {
  find: (elem, parent) =>
    new Promise((resolve, reject) => {
      let parentFind = parent.querySelectorAll(elem)
      if (parentFind.length) {
        resolve(parentFind)
      }

      let tout = null

      var observer = new MutationObserver(muts => {
        let executed = false
        let iter = muts.length
        while (iter--) {
          if (!muts[iter].addedNodes.length) continue
          executed = true
          break
        }

        if (!executed) return
        let lists = document.querySelectorAll(elem)
        if (!lists.length) return

        resolve(lists)
        observer.disconnect()

        if (tout) {
          clearTimeout(tout)
        }
      })

      observer.observe(parent || document.documentElement, {
        childList: true
      })

      tout = setTimeout(() => {
        if (!observer) return
        observer.disconnect()

        observer = undefined
        reject('Too long execution.')
      }, 3000)
    })
}

module.exports = observe
