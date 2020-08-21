const luminanace = (r, g, b) => {
  var a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const contrast = (rgb1, rgb2) => {
  var lum1 = luminanace(rgb1[0], rgb1[1], rgb1[2])
  var lum2 = luminanace(rgb2[0], rgb2[1], rgb2[2])
  var brightest = Math.max(lum1, lum2)
  var darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

const parse = str => {
  if (str[0] === '#') {
    return str
      .substring(1, str.length)
      .match(/.{1,2}/g)
      .map(v => parseInt(v, 16))
  }

  return str
    .replace(')', '')
    .split('(')[1]
    .split(',')
    .map(v => Number(v.trim()))
}

// https://gist.github.com/mjackson/5311256
const RGBtoHSL = (r, g, b) => {
  ;(r /= 255), (g /= 255), (b /= 255)

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, l]
}

const HSLtoRGB = (h, s, l) => {
  var r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    function hue2rgb (p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}

const RGBtoHEX = (...args) => '#' + args.map(v => (~~v).toString(16)).join('')

const inverseColor = c => 1 - c ** 2

module.exports = {
  luminanace,
  contrast,
  parse,
  RGBtoHSL,
  HSLtoRGB,
  RGBtoHEX,
  inverseColor
}
