interface RefresherHTTP {
  urls: {
    base: string
    gall: {
      major: string
      mini: string
      minor: string
    }
    view: string
    vote: string
    manage: {
      delete: string
    }
    comments: string
    dccon: {
      detail: string
      info: string
      buy: string
    }
  }
  types: {
    MAJOR: string
    MINOR: string
    MINI: string
  }
  commentGallTypes: {
    '': string
    mgallery: string
    mini: string
  }
  heads: {
    'X-Requested-With': string
  }
  viewRegex: RegExp
  mgall: RegExp
  query: Function
  view: Function
  make: Function
  checkMinor: Function
  checkMini: Function
  mergeParamURL: Function
  galleryType: Function
  galleryTypeName: Function
}

interface RefresherDOM {
  /**
   * 주어진 element의 자식들을 모두 탐색합니다.
   *
   * @param element 탐색할 element.
   */
  traversal(element: HTMLElement): HTMLElement[]

  /**
   * 인근 Element 들을 탐색합니다.
   * @param el 검색을 시작할 Element
   * @param find 찾을 Element의 HTML Selector
   * @param max 최대 깊이
   * @param current 현재 깊이 (내부용)
   */
  findNeighbor(
    el: HTMLElement,
    find: string,
    max: number,
    current?: number
  ): HTMLElement | null
}
