const pedidosController = require('../controllers/pedidos.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/api/pedidos', verificarToken, pedidosController.crearPedido);
    app.get('/api/pedidos', verificarToken, verificarRol('admin'), pedidosController.obtenerPedidos);
    app.put('/api/pedidos/:id', verificarToken, pedidosController.actualizarEstadoPedido);
    app.get('/api/pedidos/usuario/:numero_documento', verificarToken, pedidosController.obtenerPedidosPorUsuario);
};
