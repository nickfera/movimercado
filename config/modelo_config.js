const mongoose = require('mongoose');

const schemaConfig = new mongoose.Schema({
    propriedade: {
        type: String
    },
    valor: {
        type: mongoose.Schema.Types.Mixed
    }
});

const Configuracao = mongoose.model('configuracoes', schemaConfig);

module.exports = Configuracao;