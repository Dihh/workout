export async function getTemplate(name, path = name) {
    document.body.innerHTML += await (await fetch(`components/${path}/${name}-component.html`)).text()
}

export const API_URL = 'https://script.google.com/macros/s/AKfycbwy28CI-cTLk9CVn885QGynIg7jemhaUsAqY21kr-YRNKyJ4-1FuTfuYgih2izgBjI2/exec'

export function getParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param)
}

export async function requestPost(data, url) {
    const body = JSON.stringify(data)
    const headers = {
        'Content-Type': "text/plain;charset=utf-8",
    }
    const resp = await fetch(`${url}`, { method: "POST", headers, body, redirect: "follow" })
    return await resp.json()
}