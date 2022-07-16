export async function getTemplate(name) {
    document.body.innerHTML += await (await fetch(`components/${name}/${name}-component.html`)).text()
}
