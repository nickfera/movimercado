const express = require('express');
const router = express.Router();
const passport = require('passport');
const { validarAutenticado, redirecionarAutenticado } = require('../config/aut.js');

router.get('/login', redirecionarAutenticado, (req, res, fim) => {
    res.render('login', { title: 'Login | MoviMercado',
        msg_erro: req.flash('msg_erro'),
        msg_sucesso: req.flash('msg_sucesso'),
        error: req.flash('error')
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', validarAutenticado, (req, res, fim) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;