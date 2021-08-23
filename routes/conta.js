const express = require('express');
const router = express.Router();
const passport = require('passport');
const Usuario = require('../config/modelo_usuarios');
const bcrypt = require('bcryptjs');
const { validarAutenticado, redirecionarAutenticado } = require('../config/aut.js');

router.get('/conta', validarAutenticado, (req, res, fim) => {
    res.render('minhaconta', { title: 'Minha Conta | MoviMercado',
        msg_erro: req.flash('msg_erro'),
        msg_sucesso: req.flash('msg_sucesso'),
        aut: true,
        admin: (req.user.privilegios == 1) ? true : false,
        nome: req.user.nome,
        email: req.user.email });
});
router.post('/conta', (req, res, fim) => {
    const { senha, novasenha1, novasenha2 } = req.body;
    
    bcrypt.compare(senha, req.user.senha).then(resultado => {
        if(resultado) {
            if(!RegExp(/[\w\-]*/).test(novasenha1) || (novasenha1.length < 8) || (novasenha1.length > 18)) {
                req.flash('msg_erro', 'Sua senha deve ter letras, números, "-" ou "_" e 8 a 18 carácteres');
                res.redirect('/conta');
            } else if(novasenha1 !== novasenha2) {
                req.flash('msg_erro', 'As senhas devem ser iguais');
                res.redirect('/conta');
            } else {
                bcrypt.genSalt(10, (erro, salt) => {
                    if(erro) {
                        console.log(erro);
                        req.flash('msg_erro', 'Um erro inesperado aconteceu');
                        res.redirect('/conta');
                    }
                    bcrypt.hash(novasenha1, salt, (erro, hash) => {
                        if(erro) {
                            console.log(erro);
                            req.flash('msg_erro', 'Um erro inesperado aconteceu');
                            res.redirect('/conta');
                        }
                        Usuario.updateOne({ email: req.user.email }, { senha: hash, salt: salt }, (erro, resultado) => {
                            if(erro) {
                                console.log(erro);
                                req.flash('msg_erro', 'Um erro inesperado aconteceu');
                                res.redirect('/conta');
                            }
                            req.user.senha = hash;
                            req.user.salt = salt;
                            req.flash('msg_sucesso', 'Senha alterado com sucesso');
                            res.redirect('/conta');
                        });
                    });
                });
            }
        } else {
            req.flash('msg_erro', 'Sua senha está incorreta');
            res.redirect('/conta');
        }
    }).catch(erro => {
        console.log(erro);
        req.flash('msg_erro', 'Um erro inesperado aconteceu');
        res.redirect('/conta');
    });
});

module.exports = router;