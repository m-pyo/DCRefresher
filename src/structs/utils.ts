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
