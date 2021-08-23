const express = require('express');
const router = express.Router();
const { redirecionarAutenticado } = require('../config/aut.js');

router.get('/', (req, res, fim) => {
    if(req.isAuthenticated()) {
        res.render('index', { title: 'MoviMercado',
            msg_erro: req.flash('msg_erro'),
            msg_sucesso: req.flash('msg_sucesso'),
            aut: true,
            nome: req.user.nome,
            admin: (req.user.privilegios == 1) ? true : false
        });
    }
    else {
        res.render('index', { title: 'MoviMercado',
            msg_erro: req.flash('msg_erro'),
            msg_sucesso: req.flash('msg_sucesso'),
            aut: false
        });
    }
});

module.exports = router;