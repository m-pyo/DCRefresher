
/**
 * dcinside.com set cookie function
 */

export function set_cookie_tmp (e: string, t: string, o: number, i: string) {
    var n = new Date()
    n.setTime(n.getTime() + 36e5 * o),
        (document.cookie =
            e +
            '=' +
            escape(t) +
            '; path=/; domain=' +
            i +
            '; expires=' +
            n.toUTCString() +
            ';')
}

/**
 * dcinside.com get cookie
 */
export function get_cookie (e: string) {
    for (
        var t = e + '=', o = document.cookie.split(';'), i = 0;
        i < o.length;
        i++
    ) {
        for (var n = o[i]; ' ' == n.charAt(0); ) n = n.substring(1)
        if (0 == n.indexOf(t)) return n.substring(t.length, n.length)
    }
    return ''
}


