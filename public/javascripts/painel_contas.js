window.addEventListener("DOMContentLoaded", () => {
    const usuarios = document.querySelectorAll('#painel-contas .usuario');
    usuarios.forEach((usuario, i) => {
        document.getElementById(`privilegios-${i}`).addEventListener('change', e => {
            document.getElementById(`btn-salvar-${i}`).removeAttribute('disabled');
        }, { once: true });

        document.getElementById(`btn-salvar-${i}`).addEventListener('click', e => {
            e.preventDefault();
            let body = {
                email: document.getElementById(`email-${i}`).innerText,
                admin: document.getElementById(`privilegios-${i}`).checked,
                acao: 'salvar'
            };
            fetch('/painel/conta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            }).then(res => {
                if(res.status == 200)
                    insMsg('sucesso', 'Conta alterada com sucesso');
                else
                    insMsg('erro', 'Um erro inesperado aconteceu');
            });
        });

        document.getElementById(`btn-deletar-${i}`).addEventListener('click', e => {
            e.preventDefault();
            if(window.confirm('Tem certeza que quer deletar esta conta?')){
                let body = {
                    email: document.getElementById(`email-${i}`).innerText,
                    acao: 'deletar'
                };
                fetch('/painel/conta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(body)
                }).then(res => {
                    if(res.status == 200) {
                        document.getElementById(`usuario-${i}`).remove();
                        insMsg('sucesso', 'Conta deletada com sucesso');
                    } else
                        insMsg('erro', 'Um erro inesperado aconteceu');
                });
            }
        });
    });
});