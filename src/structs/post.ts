import { User } from './user'

export class PostInfo {
  id: string
  header?: string
  title?: string
  date?: string
  expire?: string
  user?: User
  views?: any
  upvotes?: any
  downvotes?: any
  contents?: any
  commentId?: string
  commentNo?: string
  isNotice?: boolean
  requireCaptcha?: boolean
  requireCommentCaptcha?: boolean
  disabledDownvote?: boolean
  dom?: any

  constructor (id: string, data: object) {
    this.id = id

    let keys = Object.keys(data)
    for (var i = 0; i < keys.length; i++) {
      let key = keys[i]

      this[key] = data[key]
    }
  }
}

export interface GalleryPreData {
  gallery: string
  id: string
  title?: string
  link?: string
  notice?: boolean
  recommend?: boolean
}
