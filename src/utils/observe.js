const observe = {
  find: (elem, no_observe) =>
    new Promise((resolve, reject) => {
      if (no_observe || (document && document.querySelectorAll(elem).length)) {
        resolve(document.querySelectorAll(elem))

        return
      }

      var observer = new MutationObserver(muts => {
        let executed = false
        let mutIter = muts.length
        while (mutIter--) {
          if (executed) break
          executed = muts[mutIter].addedNodes.length
        }

        if (!executed) return false

        if (document.querySelectorAll(elem).length) {
          observer.disconnect()
          resolve(document.querySelectorAll(elem))
        }

        document.addEventListener("load", () => {
          if (observer) { 
            observer.disconnect()
            reject('Too long execution.')
          }
        })
      })

      observer.observe(document.documentElement, {
        childList: true
      })
    })
}

module.exports = observe
