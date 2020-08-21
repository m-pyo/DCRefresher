/**
 * 주어진 element의 자식들을 모두 탐색합니다.
 *
 * @param element 탐색할 element.
 */
export const traversal = (element: HTMLElement): HTMLElement[] => {
  let result = []

  if (element.nodeType !== Node.ELEMENT_NODE) {
    return []
  }

  let childs = element.children
  let child_len = childs.length

  result.push(element)

  for (var i = 0; i < child_len; i++) {
    let child = childs[i] as HTMLElement

    let travel = traversal(child)
    if (travel.length) {
      result.push(...travel)
    }
  }

  return result
}
