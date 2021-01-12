import {eventBus} from '../core/eventbus'
import {filter} from '../core/filtering'
import {submitComment} from '../utils/comment'

export default {
    name: '자짤 자동 추가',
    description: '글을 읽으면 자동으로 댓글을 답니다.',
    author: {name: 'Seo-Rii', url: 'https://github.com/Seo-Rii/'},
    url: /gall\.dcinside\.com\/(mgallery\/|mini\/)?board\/(view)/g,
    status: {
        refreshRate: undefined,
        useBetterBrowse: undefined,
        fadeIn: undefined,
        autoRate: undefined,
        doNotColorVisited: false
    },
    memory: {
        uuid: ''
    },
    enable: true,
    default_enable: true,
    require: ['http', 'eventBus', 'block', 'comment'],
    settings: {
        text: {
            name: '댓글 내용',
            desc:
                '자동으로 달 댓글의 내용을 설정합니다.',
            default: '안녕',
            type: 'text'
        }
    },
    func(
        http: RefresherHTTP,
        eventBus: RefresherEventBus,
        block: RefresherBlock
    ) {
        submitComment('안녕')
    },

    revoke() {

    }
}
