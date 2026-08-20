const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');

//Importar Rutas
const usersRoutes = require('./routes/userRoutes');
const passport = require('./config/passport');

const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);


server.listen(3000, '10.1.195.210' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + process.pid + ' inicio en el puerto ' + port);
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del Backend');
});

app.get('.test,' (r))


app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack)
})

app.set('port', port);


usersRoutes(app);