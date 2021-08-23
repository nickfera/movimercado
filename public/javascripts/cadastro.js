const inpNome = document.getElementById('nome');
const inpEmail = document.getElementById('email');
const inpSenha = document.getElementById('senha');
const inpSenha2 = document.getElementById('senha2');

inpNome.addEventListener('focus', () => { inpNome.classList.remove('intocado'); }, { once: true });
inpEmail.addEventListener('focus', () => { inpEmail.classList.remove('intocado'); }, { once: true });
inpSenha.addEventListener('focus', () => { inpSenha.classList.remove('intocado'); }, { once: true });
inpSenha2.addEventListener('focus', () => { inpSenha2.classList.remove('intocado'); }, { once: true });

const checarSenhas = () => {
    if(inpSenha.validity.valid && (inpSenha.value === inpSenha2.value)) {
        inpSenha2.previousSibling.classList.remove('erro');
        inpSenha2.setCustomValidity("");
    }
    else {
        inpSenha2.previousSibling.classList.add('erro');
        inpSenha2.setCustomValidity("As senhas devem ser iguais.");
    }
};
inpSenha2.addEventListener('input', checarSenhas);
inpSenha2.addEventListener('change', checarSenhas);