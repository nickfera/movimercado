const mongoose = require('mongoose');

const schemaLogs = new mongoose.Schema({
    data: {
        type: Number,
        required: true
    },
    porta: {
        type: Number,
        required: true
    },
    acao: {
        type: Boolean,
        required: true
    }
});

const Logs = mongoose.model('logs', schemaLogs);

module.exports = Logs;