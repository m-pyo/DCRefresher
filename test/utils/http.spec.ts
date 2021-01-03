import * as http from '../../src/utils/http'

import * as chai from 'chai'

const assert = chai.assert

describe('utils - http', () => {
  it('checkMini', () => {
    assert.strictEqual(
      http.checkMini('https://gall.dcinside.com/mini/board/lists?id=refresher'),
      true
    )

    assert.strictEqual(
      http.checkMini(
        'https://gall.dcinside.com/minor/board/lists?id=refresher'
      ),
      false
    )

    assert.strictEqual(
      http.checkMini('https://gall.dcinside.com/board/lists?id=refresher'),
      false
    )
  })

  it('checkMinor', () => {
    assert.strictEqual(
      http.checkMinor(
        'https://gall.dcinside.com/mgallery/board/lists?id=refresher'
      ),
      true
    )

    assert.strictEqual(
      http.checkMinor(
        'https://gall.dcinside.com/mini/board/lists?id=refresher'
      ),
      false
    )

    assert.strictEqual(
      http.checkMinor('https://gall.dcinside.com/board/lists?id=refresher'),
      false
    )
  })

  it('view to lists URL', () => {
    assert.strictEqual(
      http.view(
        'https://gall.dcinside.com/mini/board/view/?id=refresher&no=1&page=1'
      ),
      'https://gall.dcinside.com/mini/board/lists?id=refresher&page=1'
    )

    assert.strictEqual(
      http.view(
        'https://gall.dcinside.com/mini/board/view/?id=refresher&no=1&page=1&fasdfasdfasdfasdf'
      ),
      'https://gall.dcinside.com/mini/board/lists?id=refresher&page=1&fasdfasdfasdfasdf='
    )

    assert.notStrictEqual(
      http.view(
        'https://gall.dcinside.com/mini/board/view/?id=refresher&no=1&page=1'
      ),
      'https://gall.dcinside.com/mini/board/lists?id=refresher&no=1&page=1'
    )
  })

  it('gallery type', () => {
    assert.strictEqual(
      http.galleryType(
        'https://gall.dcinside.com/mini/board/view/?id=refresher&no=1&page=1'
      ),
      'mini'
    )

    assert.strictEqual(
      http.galleryType(
        'https://gall.dcinside.com/mgallery/board/view/?id=refresher&no=1&page=1'
      ),
      'mgallery'
    )

    assert.strictEqual(
      http.galleryType(
        'https://gall.dcinside.com/mgallery/board/view/?id=refresher&no=1&page=1',
        '?extra'
      ),
      'mgallery?extra'
    )
  })
})
