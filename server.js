const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

//Importar Rutas
const usersRoutes = require('./routes/userRoutes');
const configurePassport = require('./config/passport');

const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
configurePassport(passport);

app.use(passport.initialize());

app.disable('x-powered-by');

app.set('port', port);


server.listen(3000, '192.168.80.14' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + process.pid + ' Ejecutando en el puerto ' + port);
    console.log(server.address().address + ':' + server.address().port);
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del Backend');
});

app.get('/test', (req,res) => {
    res.send('Estas en la ruta TEST');
});


app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack)
});

app.set('port', port);


usersRoutes(app);