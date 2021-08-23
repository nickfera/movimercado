const mongoose = require('mongoose');

const schemaUsuario = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    privilegios: {
        type: Number,
        default: 0
    },
    ultimaAtividade: {
        type: String,
        default: ""
    },
});

const Usuario = mongoose.model('usuarios', schemaUsuario);

module.exports = Usuario;