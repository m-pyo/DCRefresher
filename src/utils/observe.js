const observe = {
  first: (elem) =>
    new Promise((resolve, reject) => {
      var observer = new MutationObserver(muts => {
        let executed = false
        let mutIter = muts.length
        while (mutIter--) {
          if (executed) break
          executed = muts[mutIter].addedNodes.length
        }

        if (!executed) reject()

        resolve()
      })

      observer.observe(document.documentElement, {
        childList: true
      })
    })
}

module.exports = observe
