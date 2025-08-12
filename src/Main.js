async function CargaTemplate(url) {
    const res = await fetch(url);
    const txt = await res.text();

    const tmp = document.createElement('div');
    tmp.innerHTML = txt;

    return tmp.querySelector('template');
}

