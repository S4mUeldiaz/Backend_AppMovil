const pedidosController = require('../controllers/pedidos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/api/pedidos', verificarToken, pedidosController.crearPedido);
    app.put('/api/pedidos/:id', verificarToken, pedidosController.actualizarEstadoPedido);
    app.get('/api/pedidos/usuario/:numero_documento', verificarToken, pedidosController.obtenerPedidosPorUsuario);
};
