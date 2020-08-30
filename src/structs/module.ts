interface RefresherAuthor {
  name: string
  url?: string
}

interface RefresherModule {
  name: string
  description: string
  author?: RefresherAuthor
  url?: string
  status: any
  top?: boolean
  memory?: object | boolean
  enable: boolean
  default_enable: boolean
  require?: string[] | null
  func: Function | null
  revoke: Function
}
