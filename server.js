const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.set('port', port);

server.listen(3000, '10.1.195.210' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + process.pid + ' inicio en el puerto ' + port);
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del Backend');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack)
})