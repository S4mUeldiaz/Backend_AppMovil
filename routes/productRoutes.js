const productsController = require('../controllers/productController');

module.exports = (app) => {
    app.get('/api/products', productsController.getAll);
    app.get('/api/products/:id', productsController.getById);
    app.post('/api/products', productsController.create);
    app.put('/api/products/:id', productsController.update);
    app.delete('/api/products/:id', productsController.remove);
}
