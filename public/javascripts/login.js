const inpEmail = document.getElementById('email');
const inpSenha = document.getElementById('senha');

inpEmail.addEventListener('focus', () => { inpEmail.classList.remove('intocado'); }, { once: true });
inpSenha.addEventListener('focus', () => { inpSenha.classList.remove('intocado'); }, { once: true });