const express = require('express');
const router = express.Router();
const { validarAutenticado } = require('../config/aut.js');
const Configuracao = require('../config/modelo_config');

router.get('/app', validarAutenticado, async (req, res) => {
    let portas = [];
    await Configuracao.find({ propriedade: 'portas' })
        .then(resultado => {
            if(resultado.length == 0)
                req.flash('msg_erro', 'Não foi possível carregar as portas. Entre em contato com um administrador.');
            else
                portas = resultado[0].valor;
        }).catch(erro => {
            req.flash('msg_erro', 'Não foi possível carregar as portas. Entre em contato com um administrador.');
            console.log(erro);
        });
    res.render('app', { title: 'App | MoviMercado',
        msg_erro: req.flash('msg_erro'),
        msg_sucesso: req.flash('msg_sucesso'),
        aut: true,
        admin: (req.user.privilegios == 1) ? true : false,
        portas: portas
    });
});

router.get('/app-config', validarAutenticado, async (req, res) => {
    await Configuracao.find({ propriedade: {$in: ['nMax', 'nAlertaAlto', 'nAlertaMedio', 'nAlertaBaixo'] } })
    .then(resultado => {
        let configs = {};
        resultado.forEach(config => configs[config.propriedade] = config.valor);
        res.json(configs);
    }).catch(erro => {
        console.log(erro);
    });
});

module.exports = router;