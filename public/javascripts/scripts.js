window.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.startsWith('/painel')){
        document.querySelector(`nav#menu-principal a[href="/painel"]`).classList.add('atual');
        if(!window.location.pathname.endsWith('/painel'))
            document.querySelector(`nav#menu-painel a[href="${window.location.pathname}"]`).classList.add('atual');
    } else {
        if(window.location.pathname != "/")
        document.querySelector(`nav a[href="${window.location.pathname}"]`).classList.add('atual');
    }
});

const insMsg = (tipo, msg) => {
    let el = document.createElement('p');
    el.className = `msg_${tipo}`;
    el.innerText = msg;
    document.getElementsByClassName('container')[0].prepend(el);
    setTimeout(() => el.remove(), 7000);
};