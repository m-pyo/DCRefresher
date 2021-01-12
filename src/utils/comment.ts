import * as http from "./http";

export async function submitComment(memo: string) {
    const secretKey = Array.from(document.querySelectorAll('#focus_cmt > input')).map((el) => {
        return `&${el.id}=${(el as HTMLInputElement).value}`
    }).join('')
    let response = await http.make(
        http.urls.comments_submit,
        {
            method: 'POST',
            dataType: 'json',
            headers: {
                Accept: 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            cache: 'no-store',
            referrer: location.href,
            body: `id=${http.queryString('id')}&no=${http.queryString('no')}&name=${localStorage.nonmember_nick}&password=${localStorage.nonmember_pw}&memo=${memo}${secretKey}`
        }
    )
}
