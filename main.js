export async function getTemplate(name, path = name) {
    document.body.innerHTML += await (await fetch(`components/${path}/${name}-component.html`)).text()
}
