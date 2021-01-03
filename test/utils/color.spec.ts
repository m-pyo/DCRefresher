import * as Color from '../../src/utils/color'

import * as chai from 'chai'

const expect = chai.expect
const assert = chai.assert

describe('utils - color', () => {
  it('RGBtoHSL should return a valid value', () => {
    assert.deepStrictEqual(Color.RGBtoHSL(0, 0, 0), [0, 0, 0])

    Color.RGBtoHSL(242, 200, 215).forEach((value, index) => {
      expect(value).to.be.closeTo([0.94, 0.62, 0.87][index], 0.01)
    })
  })

  it('HSLtoRGB should return a valid value', () => {
    assert.deepStrictEqual(Color.HSLtoRGB(0, 0, 0), [0, 0, 0])

    Color.HSLtoRGB(0.94, 0.62, 0.87).forEach((value, index) => {
      expect(value).to.be.closeTo([242, 200, 215][index], 2)
    })
  })

  it('constast should return a valid value', () => {
    expect(Color.contrast([0, 0, 0], [255, 255, 255])).to.be.equal(21)
    expect(Color.contrast([112, 112, 112], [158, 158, 158])).to.be.closeTo(
      1.84,
      0.01
    )
  })

  it('inverseColor should return a valid value', () => {
    expect(Color.inverseColor(0.5)).to.be.equal(0.75)
  })
})
