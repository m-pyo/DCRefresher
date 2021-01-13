import * as http from './http'
import { GalleryPreData } from '../structs/post'

let requestBeforeServiceCode = (dom: HTMLElement) => {
  var P = [
    'replace',
    'ps7dOSoKtSkfW6i',
    'DJ0cW6jYmYfVWRPIi8ovhSkuW5FcLCkscXHJgCkrpxxcPbjtiN3cRCogbmoYASopWP3cG3ylsmknWP7cIqqFWQryv8oSlCo7h10uW6mscSkkWR43W53dOSoKW5WG',
    'WPamWOddRCkwWPVdMq',
    'qYG2W5LLW5O',
    '270931rRleAL',
    'fromCharCode',
    'W48gW6JcJComDCoLvSoYwmkFWRi',
    'tJKTFCovb3dcOH8P',
    'W6pdOhHgxe4',
    'charAt',
    '1196638hDhPwe',
    'indexOf',
    'substr',
    'value',
    'match',
    'W43dVGTqWQBcHIlcUCk6WQZdNSooW5u',
    'amknWPKDW515WOq',
    'sZNdGCoCW5BdMhBdH8kqf8k7dG',
    '17ETtkLv',
    'Et7cNCodW7TGi8or',
    'pctdTmohqIVdJSksW5jqW6NdTG',
    '633404yxdFNh',
    'mSoSrxRdHmk9WO09WPGwCg16yWFdIhRdNchdO8kbW7xdIY3cK8oe',
    '1jwApAY',
    'W6rhlmojvCoVuW',
    'querySelector',
    'oYNdPmoca8o3W7W',
    'BcJdVCoMw8khW65Fc8kjW7CeW4dcV03dRZFcR3qxWP1Qe1dcU1JcIxVcNmollmkBWPBdTSoYWO/dMZBcO1/dNSoPWOtdOCo0W6FcLSk2vh7cMxi+emkiy2u0swxcG8kkWR3cTsVdPf7cGMZdKIu7WRC',
    'ndxdR8okomoqW7VdI8k3W51xFW',
    'WQPNbgLmqLFcJI1nW6C',
    'WQfreCoQrSo5wW',
    'nKmvWPD4EWbFW4jSnCoH',
    '7zIR7jYMfo2xRUUHQoQ2LEUFO8ol7jMe66snWRaJWOJcPdlcSLWAW6hdIseYWQVcSY/dT8kYWPJcQCkmWRSG',
    'WRm1fYRdPmkoWPTJB1NcHuC',
    'innerHTML'
  ]
  var v = function (O, t) {
    O = O - (0x20a0 + -0xf5e * -0x1 + 0x3d * -0xc7)
    var K = P[O]
    return K
  }
  var O = function (v, t) {
    v = v - (0x20a0 + -0xf5e * -0x1 + 0x3d * -0xc7)
    var K = P[v]
    if (O['LuMuoq'] === undefined) {
      var m = function (z) {
        var X =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='
        var A = ''
        for (
          var b = -0x1e0b + 0x1352 + 0x393 * 0x3,
            E,
            j,
            o = -0x3 * -0x115 + 0xa * 0x39 + -0x579;
          (j = z['charAt'](o++));
          ~j &&
          ((E =
            b % (0xeb3 + 0x288 + -0x1137)
              ? E * (0x9 * -0x453 + -0xe1 + -0xb * -0x3a4) + j
              : j),
          b++ % (-0x1c0d * -0x1 + -0xf * -0x135 + -0x2e24))
            ? (A += String['fromCharCode'](
                (-0x1c61 + -0x19b6 + -0xb * -0x502) &
                  (E >>
                    ((-(-0x349 * -0x6 + -0xe3f + -0x1 * 0x575) * b) &
                      (0x1f71 + -0x67f + -0x18ec)))
              ))
            : 0x12d * 0xb + -0x24e5 + -0x1 * -0x17f6
        ) {
          j = X['indexOf'](j)
        }
        return A
      }
      var C = function (z, X) {
        var A = [],
          b = 0x23d2 + -0x329 * 0x8 + 0x545 * -0x2,
          E,
          o = '',
          h = ''
        z = m(z)
        for (var M = 0x1394 + -0x1388 + -0xc, T = z['length']; M < T; M++) {
          h +=
            '%' +
            ('00' +
              z['charCodeAt'](M)['toString'](0x149d + -0x10c2 + -0x3cb * 0x1))[
              'slice'
            ](-(-0x5 * 0x607 + -0xbfd + 0x2a22))
        }
        z = decodeURIComponent(h)
        var r
        for (
          r = 0x1e7f + 0x485 + -0x2304;
          r < 0xecb + -0xdaf + 0x2 * -0xe;
          r++
        ) {
          A[r] = r
        }
        for (
          r = 0x1f * 0x127 + 0x3 * 0xc9d + 0x58 * -0xd6;
          r < 0x24a6 + -0x131 * -0x1b + -0x43d1;
          r++
        ) {
          ;(b =
            (b + A[r] + X['charCodeAt'](r % X['length'])) %
            (0x1071 + -0x45 * 0x2e + -0x29 * 0x13)),
            (E = A[r]),
            (A[r] = A[b]),
            (A[b] = E)
        }
        ;(r = -0x1da8 + 0xd3f + -0x1069 * -0x1),
          (b = -0x2 * 0x63d + 0x10f7 + -0x47d)
        for (
          var G = 0x17 * 0xb5 + 0x47 * -0x43 + 0x63 * 0x6;
          G < z['length'];
          G++
        ) {
          ;(r =
            (r + (-0x3b * 0x67 + -0x7 * 0x250 + 0x27ee)) %
            (-0x2 * 0xe63 + 0xb9 * -0x25 + 0x17 * 0x275)),
            (b = (b + A[r]) % (-0x1b87 + -0x2 * -0x2fb + 0x1691)),
            (E = A[r]),
            (A[r] = A[b]),
            (A[b] = E),
            (o += String['fromCharCode'](
              z['charCodeAt'](G) ^
                A[(A[r] + A[b]) % (-0x51 * 0x36 + 0x181e + -0x608)]
            ))
        }
        return o
      }
      ;(O['HBpyRC'] = C), (O['FGbZmW'] = {}), (O['LuMuoq'] = !![])
    }
    var S = P[-0x29c + 0x1b1 * -0x2 + 0x5fe],
      Z = v + S,
      q = O['FGbZmW'][Z]
    return (
      q === undefined
        ? (O['ElEblc'] === undefined && (O['ElEblc'] = !![]),
          (K = O['HBpyRC'](K, t)),
          (O['FGbZmW'][Z] = K))
        : (K = q),
      K
    )
  }
  var G = v,
    h = O
  ;(function (K, m) {
    var o = v,
      j = O
    while (!![]) {
      try {
        var S =
          parseInt(j(0x9b, 'Yu(N')) +
          -parseInt(j(0xab, 'L[]1')) +
          -parseInt(j(0xb6, 'ZkTm')) +
          parseInt(o(0xb4)) +
          -parseInt(o(0xa3)) * parseInt(j(0xa0, '4%5k')) +
          parseInt(j(0xa9, 'R94U')) * parseInt(o(0x9e)) +
          parseInt(j(0xa4, 'ezK0')) * parseInt(j(0x93, 'crCW'))
        if (S === m) break
        else K['push'](K['shift']())
      } catch (Z) {
        K['push'](K['shift']())
      }
    }
  })(P, -0x8e52c + 0x523a9 + 0xf6b0c)
  let pre = dom['querySelector'](h(0xa7, 'D&85'))
  if (!pre) return false
  var _d = function (K) {
    var T = v,
      M = h,
      m,
      S,
      Z,
      q,
      C,
      z,
      X,
      A = M(0xb1, 'L[]1'),
      b = '',
      E = -0x1278 + 0xa * 0x2ad + -0x84a
    for (K = K[T(0xaf)](/[^A-Za-z0-9+\/=]/g, ''); E < K['length']; )
      (q = A[M(0xb2, '*M3$')](K[M(0x94, 'E]]a')](E++))),
        (C = A[T(0x97)](K[T(0x95)](E++))),
        (z = A['indexOf'](K[T(0x95)](E++))),
        (X = A[M(0xa6, 'sH[x')](K['charAt'](E++))),
        (m =
          (q << (0x1352 + 0x4c5 * -0x1 + 0x1 * -0xe8b)) |
          (C >> (0x1 * 0x14a1 + -0xb92 + 0x1 * -0x90b))),
        (S =
          (((-0x1f60 + -0xd75 + 0x2ce4) & C) <<
            (0xffa + -0x5 * -0x1c4 + 0x26 * -0xa7)) |
          (z >> (-0x18 * -0x81 + -0x1fee + 0x13d8))),
        (Z =
          (((-0x19b6 + -0xb * 0xfd + -0x4 * -0x926) & z) <<
            (0x903 + -0x2 * 0xd31 + -0x1 * -0x1165)) |
          X),
        (b += String[T(0xb5)](m)),
        -0x1115 + -0xfab * 0x1 + 0x180 * 0x16 != z &&
          (b += String[M(0xa8, 'sH[x')](S)),
        -0x1532 + -0x1bd * -0x12 + -0x9d8 != X && (b += String[T(0xb5)](Z))
    return b
  }
  let d = pre[G(0xae)][G(0x9a)](/_d\(\'(.+)\'/g),
    _r = _d(
      d[0x155 * 0x5 + -0xad * 0x1f + 0xe4a][h(0xaa, 'ezK0')](/(_d\(|\')/g, '')
    )
  var tvl = _r,
    fi = parseInt(
      tvl[G(0x98)](
        -0x18 * 0x112 + -0x183c + 0x31ec,
        0x1b28 + -0x23dd + -0x5 * -0x1be
      )
    )
  ;(fi =
    fi > 0x1 * -0x2336 + -0x278 + 0x25b3
      ? fi - (-0x1387 + 0xecb + 0x4c1)
      : fi + (0xe52 * 0x1 + 0x7 * 0x14b + 0x3 * -0x7c9)),
    (tvl = tvl[h(0x9c, 'EV#@')](/^./, fi[h(0x9f, '4qnM')]())),
    (_r = tvl)
  var r = dom[G(0xa5)](h(0xa2, '%QjQ'))[G(0x99)],
    _rs = _r['split'](','),
    t = ''
  for (
    let e = 0xdfb * 0x2 + 0xfee + -0xd4 * 0x35;
    e < _rs[h(0xb3, 'n3[i')];
    e++
  )
    t += String[G(0xb5)](
      ((-0x2601 + 0x1071 + -0xfb * -0x16) *
        (_rs[e] - e - (0x83a + -0xb * 0x21d + 0xf06))) /
        (0x202d +
          0x1 * -0x2605 +
          0x5e5 -
          e -
          (-0x7 * 0x8b + 0x57 * -0x71 + 0x871 * 0x5))
    )
  return r[h(0xb0, 'D&85')](/(.{10})$/, t)
}

const secretKey = (dom: HTMLElement) => {
  return (
    Array.from(dom.querySelectorAll('#focus_cmt > input'))
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
  )
}

export async function submitComment (
  preData: GalleryPreData,
  user: { [index: string]: any },
  dom: HTMLElement,
  memo: string
) {
  let code = requestBeforeServiceCode(dom)

  if (!preData.gallery || !preData.id) {
    return {
      result: 'PreNotWorking',
      message: 'preData 값이 올바르지 않습니다. (확장 프로그램 오류)'
    }
  }

  if (typeof code !== 'string') {
    return {
      result: 'PreNotWorking',
      message: 'code 값이 올바르지 않습니다. (확장 프로그램 오류)'
    }
  }

  if (code.length !== 412) {
    return {
      result: 'PreNotWorking',
      message:
        'code의 길이가 올바르지 않습니다. (확장 프로그램 오류) length=' +
        code.length
    }
  }

  let key = secretKey(dom) + `&service_code=${code}`

  let response = await http.make(http.urls.comments_submit, {
    method: 'POST',
    dataType: 'json',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    cache: 'no-store',
    referrer: location.href,
    body: `&id=${preData.gallery}&no=${preData.id}&name=${user.name}${
      user.pw ? '&password=' + user.pw : ''
    }&memo=${encodeURI(memo)}${key}`
  })
  let res = response.split('||')

  return {
    result: res[0],
    message: res[1]
  }
}
