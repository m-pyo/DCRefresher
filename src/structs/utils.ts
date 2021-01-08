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
  /**
   * URL에 /board/view가 포함되어 있을 경우 /board/lists로 바꿔줍니다.
   * @param url
   */
  view(url: string): string
  make(url: string, options: object): Promise<string>
  /**
   * 마이너 갤러리인지를 확인하여 boolean을 반환합니다.
   * @param url 확인할 URL
   */
  checkMinor(url: string): boolean
  /**
   * 미니 갤러리인지를 확인하여 boolean을 반환합니다.
   * @param url 확인할 URL
   */
  checkMini(url: string): boolean
  mergeParamURL(origin: string, getFrom: string): string
  /**
   * URL에서 갤러리 종류를 확인하여 반환합니다.
   *
   * @param url 갤러리 종류를 확인할 URL.
   * @param extra 마이너 갤러리와 미니 갤러리에 붙일 URL suffix.
   */
  galleryType(url: string, extra?: string): string
  /**
   * URL에서 갤러리 종류를 확인하여 갤러리 종류 이름을 반환합니다.
   * (mgallery, mini, '')
   *
   * @param url
   */
  galleryTypeName(url: string): string
  /**
   * 현재 URL의 query를 가져옵니다.
   *
   * @param name Query 이름
   */
  queryString(name: string): string | null
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
