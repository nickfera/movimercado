const passport = require('passport');
const StrategiaLocal = require('passport-local').Strategy;
const Usuario = require('../config/modelo_usuarios');
const bcrypt = require('bcryptjs');

module.exports = passport => {
    passport.use(new StrategiaLocal(
        { usernameField: 'email', passwordField: 'senha' },
        (email, senha, fim) => {
            Usuario.findOne({ email: email }, (erro, usuario) => {
                if(erro) return fim(erro);
                if(!usuario) {
                    return fim(null, false, { message: 'O e-mail está incorreto' });
                } else if(usuario) {
                    bcrypt.compare(senha, usuario.senha, async (erro, res) => {
                        if(erro) return fim(erro);
                        if(res) {
                            let d = new Date();
                            d.setHours(d.getHours() - 3);
                            usuario.ultimaAtividade = `${d.toISOString()}-login`;
                            await usuario.save();
                            return fim(null, usuario);
                        } else if(!res) {
                            return fim(null, false, { message: 'A senha está incorreta' });
                        }
                    });
                }
            });
        }
    ));

    passport.serializeUser((usuario, fim) => {
        fim(null, usuario.id);
    });
    passport.deserializeUser((id, fim) => {
        Usuario.findById(id, (erro, usuario) => {
            fim(erro, usuario);
        });
    });
};