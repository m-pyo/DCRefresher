interface RefresherFilter {
  /**
   * 필터로 등록된 함수들을 전부 실행합니다.
   *
   * @param non_blocking 비차단 방식으로 렌더링 합니다. (페이지 로드 후)
   */
  run: Function
  /**
   * 파라매터로 주어진 UUID를 가진 필터를 실행합니다.
   *
   * @param id UUID를 지정합니다.
   */
  runSpecific: Function
  /**
   * 필터로 사용할 함수를 등록합니다.
   */
  add: Function
  /**
   * UUID를 직접 선언하여 함수를 필터로 등록합니다.
   */
  addGlobal: Function
  /**
   * 해당 UUID를 가진 필터를 제거합니다.
   */
  remove: Function
  /**
   * 해당 UUID의 이벤트에 콜백 함수를 등록합니다.
   */
  on: Function
  /**
   * 해당 UUID에 이벤트를 발생시킵니다.
   */
  events: Function
}

interface RefresherEventBus {
  emit: Function
  emitNextTick: Function
  emitForResult: Function
  on: Function
  remove: Function
}

interface RefresherFrame {
  title: string
  subtitle: string

  class: string
  app: Vue
  contents: string
  comments: any
  upvotes: any
  downvotes: any
  buttonError: any

  data: { [index: string]: any }
  functions: { [index: string]: Function }
}
