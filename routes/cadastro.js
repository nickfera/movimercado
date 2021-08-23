const express = require('express');
const router = express.Router();
const Usuario = require('../config/modelo_usuarios');
const Configuracao = require('../config/modelo_config');
const bcrypt = require('bcryptjs');
const { redirecionarAutenticado } = require('../config/aut.js');

router.get('/cadastro', redirecionarAutenticado, (req, res, fim) => {
    Configuracao.findOne({ propriedade: 'cadastroAberto'}, 'valor', (erro, cadastroAberto) => {
        if(erro) {
            console.log(erro);
            req.flash('msg_erro', 'Um erro inesperado aconteceu');
            res.redirect('/');
        }
        if(cadastroAberto.valor) {
            res.render('cadastro', { title: 'Cadastro | MoviMercado' });
        } else if(!cadastroAberto.valor) {
            req.flash('msg_erro', 'Desculpe, no momento o cadastro está fechado');
            res.redirect('/login');
        }
    })
});

router.post('/cadastro', (req, res, fim) => {
    const { nome, email, senha, senha2 } = req.body;
    const renderComErro = (erro) => {
        res.render('cadastro', {
            title: 'Cadastro | MoviMercado',
            msg_erro: erro,
            nome, email, senha, senha2
        });
    };
    let msg_erro;

    if(!nome || !email || !senha || !senha2) {
        msg_erro = 'Preenche todos os campos';
    } else if((!RegExp(/^[a-z\s]+$/gi).test(nome)) || (nome.length < 3) || (nome.length > 30)) {
        msg_erro = 'Digite um nome válido';
    } else if(!RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(email)) {
        msg_erro = 'Digite um e-mail válido';
    } else if(!RegExp(/[\w\-]*/).test(senha) || !RegExp(/[\w\-]*/).test(senha2) || (senha.length < 8) || (senha.length > 18)) {
        msg_erro = 'Sua senha deve ter letras, números, "-" ou "_" e 8 a 18 carácteres';
    } else if(senha !== senha2) {
        msg_erro = 'As senhas devem ser iguais';
    }
    if(msg_erro) {
        renderComErro(msg_erro);
    } else {
        Usuario.findOne({ email: email }, (erro, usuario) => {
            if(erro) {
                console.log(erro);
                renderComErro('Um erro inesperado aconteceu. Por favor, se o erro persiste, entre em contato com um dos administradores');
            }

            if(usuario) {
                renderComErro('O e-mail já esta cadastrado.');
            } else {
                bcrypt.genSalt(10, (erro, salt) => {
                    if(erro) {
                        console.log(erro);
                        renderComErro('Um erro inesperado aconteceu. Por favor, se o erro persiste, entre em contato com um dos administradores');
                    } else {
                        bcrypt.hash(senha, salt, (erro, hash) => {
                            if(erro) {
                                console.log(erro);
                                renderComErro('Um erro inesperado aconteceu. Por favor, se o erro persiste, entre em contato com um dos administradores');
                            } else {
                                const novoUsuario = Usuario({
                                    nome: nome,
                                    email: email,
                                    senha: hash,
                                    salt: salt
                                });
                                novoUsuario.save(erro => {
                                    if(erro) {
                                        console.log(erro);
                                        renderComErro('Um erro inesperado aconteceu. Por favor, se o erro persiste, entre em contato com um dos administradores');
                                    } else {
                                        req.flash('msg_sucesso', 'Conta criada com sucesso');
                                        res.redirect('/login');
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
    }
});

module.exports = router;