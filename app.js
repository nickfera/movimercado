const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser')
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passportSocketIo = require('passport.socketio');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();
const { RateLimiterMemory } = require('rate-limiter-flexible');

dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport);

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-cwxnm.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).catch(erro => console.log(erro));

mongoose.connection.on('error', erro => {
    console.log(erro);
});

app.use(cookieParser(process.env.SESS_SECRET));
app.use(session({
    secret: process.env.SESS_SECRET,
    key: 'sid',
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 12*60*60 }),
    resave: true,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: true }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require('./routes/index');
const appRouter = require('./routes/app');
const loginRouter = require('./routes/login');
const cadastroRouter = require('./routes/cadastro');
const contaRouter = require('./routes/conta');
const painelRouter = require('./routes/painel');

app.enable('trust proxy');
app.use((req, res, next) => {
    if(req.headers['x-forwarded-proto'] != 'https')
        res.redirect(`https://${req.headers.host}${req.url}`);
    else
        next();
});

app.use('/', indexRouter);
app.use('/', appRouter);
app.use('/', loginRouter);
app.use('/', cadastroRouter);
app.use('/', contaRouter);
app.use('/', painelRouter);

const server = http.createServer(app);
const port = process.env.PORT || '3000';
server.listen(port);
console.log(`Servidor executando na porta ${port}...`);

const Configuracao = require('./config/modelo_config');
const Logs = require('./config/modelo_logs');

let registrarMovimento;
let nPessoasAtual;

Configuracao.findOne({ propriedade: 'registrarMovimento' }, 'valor', (erro, q) => {
    if(erro) console.log(erro);
    registrarMovimento = q.valor;
    console.log(`registrarMovimento: ${registrarMovimento}`);
});
Configuracao.findOne({ propriedade: 'nPessoasAtual' }, 'valor', (erro, q) => {
    if(erro) console.log(erro);
    nPessoasAtual = q.valor;
    console.log(`Número de pessoas no estabelecimento: ${nPessoasAtual}`);
});

const io = require('socket.io')(server);

const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 1
});

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'sid',
    secret: process.env.SESS_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 12*60*60 }),
    success: (data, accept) => {
        console.log(`Conexão sucedido. IP: ${data.headers['x-forwarded-for']}`);
        accept();
    },
    fail: (data, message, error, accept) => {
        if(error) console.log(error);
        console.log(`Conexão falhou. IP: ${data.headers['x-forwarded-for']}`);
        console.log(message);
        accept(message, false);
    }
  }));



io.on('connection', (socket) => {
    io.emit('atualizar contador', nPessoasAtual);
    console.log(`O ${socket.request.user.nome} está conectado. IP: ${socket.request.headers['x-forwarded-for']};`);

    socket.on('disconnect', () => {
        console.log(`O ${socket.request.user.nome} foi desconectado`);
    });

    socket.on('add contador', async (entrada) => {
        try {
            await rateLimiter.consume(socket.id);
            if(registrarMovimento) {
                let d = Math.floor( Date.now() / 1000);
                Logs.create({ 'data': d, 'porta': entrada, 'acao': true })
                    .catch(erro => console.log(erro));
            }
            nPessoasAtual++;
            let hora = new Date();
            hora.setHours(hora.getHours()-3);
            console.log(`evento: add contador; usuario: ${socket.request.user.nome}; IP: ${socket.request.headers['x-forwarded-for']}; porta: ${entrada}; hora: ${hora}`);
            io.emit('atualizar contador', nPessoasAtual);
        } catch(rejRes) {
            console.log(`Muitas acoes consecutivas. usuario: ${socket.request.user.nome}; IP: ${socket.request.headers['x-forwarded-for']};`);
            socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
        }
    });
    socket.on('sub contador', async (entrada) => {
        try {
            await rateLimiter.consume(socket.id);
            if(nPessoasAtual > 0) {
                if(registrarMovimento) {
                    let d = Math.floor( Date.now() / 1000);
                    Logs.create({ 'data': d, 'porta': entrada, 'acao': false })
                        .catch(erro => console.log(erro));
                }
                nPessoasAtual--;
                let hora = new Date();
                hora.setHours(hora.getHours()-3);
                console.log(`evento: sub contador; usuario: ${socket.request.user.nome}; IP: ${socket.request.headers['x-forwarded-for']}; porta: ${entrada}; hora: ${hora}`);
                io.emit('atualizar contador', nPessoasAtual);
            }
        } catch(rejRes) {
            console.log(`Muitas acoes consecutivas. usuario: ${socket.request.user.nome}; IP: ${socket.request.headers['x-forwarded-for']};`);
            socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
        }
    });
    socket.on('solicitar atualizacao', () => {
        console.log('atualizacao solicitada');
        socket.emit('atualizar contador', nPessoasAtual);
    });
});

const updateInterval = setInterval(() => {
    Configuracao.updateOne({ propriedade: 'nPessoasAtual' }, { valor: nPessoasAtual }, (erro, q) => {
        if(erro) console.log(erro);
    });
}, 5000);