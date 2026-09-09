const productosController = require('../controllers/productos.controller');

module.exports = (app) => {
    app.get('/api/productos/categoria', productosController.obtenerCategorias);
    app.get('/api/productos', productosController.obtenerProductos);
    app.get('/api/productos/:id', productosController.obtenerProductoPorId);
};