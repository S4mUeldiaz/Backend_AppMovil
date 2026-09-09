const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

//Importar Rutas
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const stockRoutes = require('./routes/stock.routes');
const favoritosRoutes = require('./routes/favoritos.routes');

const port = process.env.PORT || 3002;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.disable('x-powered-by');

app.set('port', port);

server.listen(port, '0.0.0.0', function() {
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

authRoutes(app);
productosRoutes(app);
stockRoutes(app);
favoritosRoutes(app);