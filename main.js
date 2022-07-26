export async function getTemplate(name, path = name) {
    document.body.innerHTML += await (await fetch(`components/${path}/${name}-component.html`)).text()
}

export const API_URL = 'https://script.google.com/macros/s/AKfycbzxMV1bHOIW8BMH8TrRimbNW3rIAMrCczLYVOoTfxeprIfZBTsh2JhrEidF5wnTnB9J/exec'

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
    return await (await fetch(`${url}`, { method: "POST", headers, body, redirect: "follow" })).json()
}