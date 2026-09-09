const stockController = require('../controllers/stock.controller');

module.exports = (app) => {
    app.get('/api/stock', stockController.obtenerStock);
    app.get('/api/stock/producto/:id_producto', stockController.obtenerStockPorProducto);
};