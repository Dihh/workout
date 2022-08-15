export async function getTemplate(name, path = name) {
    document.body.innerHTML += await (await fetch(`components/${path}/${name}-component.html`)).text()
}

export const API_URL = 'https://script.google.com/macros/s/AKfycbzHkXUu3r1-C7PvmvEq2AW-pZMHzqfrXnqamWyoLzj5L80H21C3LgYbZoh4jGwa8qGv/exec'

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

export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}