const inpSenha = document.getElementById('senha');
const inpNovaSenha1 = document.getElementById('novasenha1');
const inpNovaSenha2 = document.getElementById('novasenha2');

inpSenha.addEventListener('focus', () => { inpSenha.classList.remove('intocado'); }, { once: true });
inpNovaSenha1.addEventListener('focus', () => { inpNovaSenha1.classList.remove('intocado'); }, { once: true });
inpNovaSenha2.addEventListener('focus', () => { inpNovaSenha2.classList.remove('intocado'); }, { once: true });

const checarSenhas = () => {
    if(inpNovaSenha1.validity.valid && (inpNovaSenha1.value === inpNovaSenha2.value)) {
        inpNovaSenha1.classList.remove('erro');
        inpNovaSenha2.setCustomValidity("");
    }
    else {
        inpNovaSenha1.classList.add('erro');
        inpNovaSenha2.setCustomValidity("As senhas devem ser iguais.");
    }
};
inpNovaSenha2.addEventListener('input', checarSenhas);
inpNovaSenha2.addEventListener('change', checarSenhas);