function selectDCON(e) {
    const str = (window.chrome && window.chrome.storage)

    if (!str) {
        throw new Error("This browser doesn't support storage API.")
    }

    let obj = {}
    obj['자짤 자동 추가.dccon'] = e.currentTarget.id;
    (str.sync || str.local).set(obj)

    chrome.tabs.query({active: true, currentWindow: false}, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
        window.close()
    });

}

function dcconDetail(e) {
    fetch(`https://dccon.dcinside.com/index/package_detail`,
        {
            method: 'POST',
            dataType: 'json',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            cache: 'no-store',
            referrer: `https://dccon.dcinside.com/hot/1/title/${document.getElementById('title').value}`,
            body: `package_idx=${e.currentTarget.id.toString()}&code=`
        }).then(res => res.json()).then(res => {
        document.getElementById('main').innerHTML = `
            <h1>${res.info.title}</h1>
            <h3>${res.info.description}</h3>
        `
        res.detail.forEach(el => {
            let newElement = document.createElement('img')
            newElement.src = 'https://dcimg5.dcinside.com/dccon.php?no=' + el.path
            newElement.alt = el.title
            newElement.style = 'width:33%;float:left;cursor:pointer;'
            newElement.addEventListener('click', selectDCON)

            newElement.id = `${el.package_idx}||${el.idx}||${el.path}`
            document.getElementById('main').appendChild(newElement)
        })
    })
}

function search() {
    fetch(`https://dccon.dcinside.com/hot/1/title/${document.getElementById('title').value}`).then(res => res.text()).then(res => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(res, "text/html")
        document.getElementById('main').innerHTML = ''
        let elS = doc.querySelector('.dccon_shop_list')
        elS.querySelectorAll('li').forEach((el) => {
            let thumbnail = el.querySelector('img').src
            let name = el.querySelector('.dcon_name').innerText
            let by = el.querySelector('.dcon_seller').innerText
            let id = el.querySelector('a').href.split('#')[1]
            let newElement = document.createElement('div')
            newElement.style.width = 'calc(100% - 20px)'
            newElement.style.float = 'left'
            newElement.style.cursor = 'pointer'
            newElement.id = id
            newElement.addEventListener('click', dcconDetail)
            newElement.innerHTML = `
                <img src="${thumbnail}" style="float: left;height:100px;margin-right: 20px;">
                <div style="float: left;">
                    <h2>${name}</h2>
                    <h4>${by}</h4>
                </div>`
            document.getElementById('main').appendChild(newElement)
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('click', search)
    document.getElementById('title').addEventListener('change', search)
})
