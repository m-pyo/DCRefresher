/**
 * 주어진 element의 자식들을 모두 탐색합니다.
 * 
 * @param {HTMLElement} element 탐색할 element.
 */
const traversal = element => {
  let result = []

  if (!element instanceof HTMLElement) {
    throw new Error('Given argument is not a HTMLElement.')
  }

  if (element.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  let childs = element.children
  let child_len = childs.length

  result.push(element)

  for (var i = 0; i < child_len; i++) {
    let child = childs[i]

    let travel = traversal(child)
    if (travel) {
      result.push(...travel)
    }
  }

  return result
}

module.exports = {
  traversal
}
