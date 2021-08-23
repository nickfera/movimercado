const express = require('express');
const router = express.Router();
const { validarAutenticado, checarPrivilegios } = require('../config/aut.js');
const Configuracao = require('../config/modelo_config');
const Usuario = require('../config/modelo_usuarios');
const Logs = require('../config/modelo_logs');

router.get('/painel/', validarAutenticado, checarPrivilegios, (req, res) => {
    res.render('painel', { title: 'Painel de Controle | MoviMercado',
        msg_erro: req.flash('msg_erro'),
        msg_sucesso: req.flash('msg_sucesso'),
        aut: true,
        admin: true
    });
});

router.get('/painel/config', validarAutenticado, checarPrivilegios, (req, res) => {
    Configuracao.find({ 'propriedade': { $ne: 'nPessoasAtual' } }, 'propriedade valor', (erro, config) => {
        if(erro) {
            console.log(erro);
            req.flash('msg_erro', 'Um erro inesperado aconteceu');
            res.redirect('/painel/');
        }
        res.render('painel_config', { title: 'Gerenciar Configurações | MoviMercado',
            config: config,
            msg_erro: req.flash('msg_erro'),
            msg_sucesso: req.flash('msg_sucesso'),
            aut: true,
            admin: true
        });
    });
});

router.post('/painel/config', validarAutenticado, checarPrivilegios, (req, res) => {
    const { cadastroAberto, registrarMovimento, nMax, nAlertaAlto, nAlertaMedio, nAlertaBaixo } = req.body;
    const redComErro = (erro) => {
        console.log(erro);
        req.flash('msg_erro', 'Um erro inesperado aconteceu. Entre em contato com um dos administradores.');
        res.redirect('/painel/config');
    }
    Configuracao.updateOne({ propriedade: 'cadastroAberto' },
        { valor: ((cadastroAberto == "true") ? true : false) }, (erro, qres) => {
            if(erro) redComErro(erro);
    });
    Configuracao.updateOne({ propriedade: 'registrarMovimento' },
        { valor: ((registrarMovimento == "true") ? true : false) }, (erro, qres) => {
            if(erro) redComErro(erro);
    });
    Configuracao.updateOne({ propriedade: 'nMax' }, { valor: nMax }, (erro, qres) => {
            if(erro) redComErro(erro);
    });
    Configuracao.updateOne({ propriedade: 'nAlertaAlto' }, { valor: nAlertaAlto }, (erro, qres) => {
            if(erro) redComErro(erro);
    });
    Configuracao.updateOne({ propriedade: 'nAlertaMedio' }, { valor: nAlertaMedio }, (erro, qres) => {
            if(erro) redComErro(erro);
    });
    Configuracao.updateOne({ propriedade: 'nAlertaBaixo' }, { valor: nAlertaBaixo }, (erro, qres) => {
            if(erro) redComErro(erro);
    });
    req.flash('msg_sucesso', 'Alterações nas configurações foram salvas com sucesso');
    res.redirect('/painel/config');
});

router.get('/painel/contas', validarAutenticado, checarPrivilegios, (req, res) => {
    Usuario.find({ email: { $ne: req.user.email }  }, 'nome email privilegios', (erro, usuarios) => {
        if(erro) {
            console.log(erro);
            req.flash('msg_erro', 'Um erro inesperado aconteceu');
            res.redirect('/painel');
        }
        res.render('painel_contas', { title: 'Gerenciar Contas | MoviMercado',
            msg_erro: req.flash('msg_erro'),
            msg_sucesso: req.flash('msg_sucesso'),
            aut: true,
            admin: true,
            usuarios: usuarios
        });
    });
});

router.post('/painel/conta', validarAutenticado, checarPrivilegios, (req, res) => {
    if(req.body.acao == 'salvar') {
        Usuario.findOneAndUpdate({ email: req.body.email }, { privilegios: (req.body.admin) ? 1 : 0 }, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                res.send(true);
            }
        });
    } else if(req.body.acao = 'deletar') {
        Usuario.findOneAndDelete({ email: req.body.email }, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                res.send(true);
            }
        });
    }
});

router.get('/painel/analise', validarAutenticado, checarPrivilegios, (req, res) => {
    res.render('painel_analise', { title: 'Análise | MoviMercado',
        msg_erro: req.flash('msg_erro'),
        msg_sucesso: req.flash('msg_sucesso'),
        aut: true,
        admin: true
    });
});

router.post('/painel/fetch-log', validarAutenticado, checarPrivilegios, async (req, res) => {
    let { d } = req.body;
    let dMax = (d + (24 * 60 * 60)) - 1;
    await Logs.find({ data: { $gt: d, $lt: dMax } }, (erro, log) => {
        if(erro) {
            console.log(erro);
            res.send({ msg_erro: 'Um erro inesperado aconteceu' })
        }
        else {
            res.send({ log: log });
        }
    });
});
router.post('/painel/delete-log', validarAutenticado, checarPrivilegios, async (req, res) => {
    let { d } = req.body;
    let dMax = (d + (24 * 60 * 60)) - 1;
    await Logs.deleteMany({ data: { $gt: d, $lt: dMax } }, (erro, n) => {
        if(erro) {
            console.log(erro);
            res.send({ msg_erro: 'Um erro inesperado aconteceu' })
        }
        else {
            res.send({ n: n });
        }
    });
});

module.exports = router;