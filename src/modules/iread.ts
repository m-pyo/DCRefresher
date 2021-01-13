import { eventBus } from '../core/eventbus'
import { submitComment } from '../utils/comment'

export default {
  name: '자짤 자동 추가',
  description: '글을 읽으면 자동으로 댓글을 답니다.',
  author: { name: 'Seo-Rii', url: 'https://github.com/Seo-Rii/' },
  url: /gall\.dcinside\.com\/(mgallery\/|mini\/)?board\/(view)/g,
  status: {
    dccon: ''
  },
  memory: {
    uuid: '',
    sent: false
  },
  enable: true,
  default_enable: true,
  require: ['filter'],
  settings: {
    dccon: {
      name: '댓글 내용',
      desc: '자동으로 달 댓글의 내용을 설정합니다.',
      default: '없음',
      type: 'dccon'
    }
  },
  func (filter: RefresherFilter) {
    this.memory.uuid = filter.add('#focus_cmt', (el: HTMLElement) => {
      const secretKey =
        Array.from(el.parentElement.querySelectorAll('#focus_cmt > input'))
          .map(el => {
            let id = el.name || el.id
            if (
              id === 'service_code' ||
              id === 'gallery_no' ||
              id === 'clickbutton'
            ) {
              return ``
            } else {
              return `&${id}=${(el as HTMLInputElement).value}`
            }
          })
          .join('') + '&t_vch2=&g-recaptcha-response='
      if (!this.memory.sent) {
        this.memory.sent = true
        return
        submitComment(secretKey, '안녕').then(res => {
          if (res.result === 'false') alert(res.message)
        })
      }
    })
  },

  revoke (filter: RefresherFilter) {
    filter.remove(this.memory.uuid)
  }
}
