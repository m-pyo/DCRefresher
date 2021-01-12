import * as http from "./http";

export async function submitComment(secretKey: string, memo: string) {
    let response = await http.make(
        http.urls.comments_submit,
        {
            method: 'POST',
            dataType: 'json',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            cache: 'no-store',
            referrer: location.href,
            body: `id=${http.queryString('id')}&no=${http.queryString('no')}&name=${localStorage.nonmember_nick}&password=${localStorage.nonmember_pw}&memo=${memo}${secretKey}`
        }
    )
    let res = response.split('||')

    return {
        result: res[0],
        message: res[1]
    }
}
