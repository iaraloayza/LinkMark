const API_URL = window.__CONFIG__.API_URL;

async function loadLinks() {
    const res = await fetch(`${API_URL}/links`);
    const json = await res.json();
    const list = document.getElementById('links');
    list.innerHTML = json.data.map(l => `<li><a href="${l.url}" target="_blank">${l.title}</a></li>`).join('');
}

async function addLink(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url })
    });
    loadLinks();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form-link').addEventListener('submit', addLink);
    loadLinks();
});
