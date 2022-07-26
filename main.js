export async function getTemplate(name, path = name) {
    document.body.innerHTML += await (await fetch(`components/${path}/${name}-component.html`)).text()
}
export const API_URL = 'https://script.google.com/macros/s/AKfycbwGzr-F10qrGXfaDosZdxz4oK-a-krDyuqQ8O4qnpljoP0MNlKRvxwfMxHKavpMCW4b/exec'