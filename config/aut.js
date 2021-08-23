module.exports = {
    validarAutenticado: (req, res, fim) => {
        if(req.isAuthenticated()) {
            return fim();
        } else {
            req.flash('msg_erro', 'Acesso restrito apenas para cadastrados');
            res.redirect('/login');
        }
    },
    redirecionarAutenticado: (req, res, fim) => {
        if(!req.isAuthenticated()) {
            return fim();
        } else {
            res.redirect('/');
        }
    },
    checarPrivilegios: (req, res, fim) => {
        if(req.user.privilegios == 1) {
            return fim();
        } else {
            req.flash('msg_errro', 'Acesso restrito');
            res.redirect('/');
        }
    }
};