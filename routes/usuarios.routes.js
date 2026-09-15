const usuariosController = require('../controllers/usuarios.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.put('/api/usuarios/:numero_documento', verificarToken, usuariosController.actualizarUsuario);
    app.patch('/api/usuarios/:numero_documento/password', verificarToken, usuariosController.cambiarPassword);
    app.delete('/api/usuarios/:numero_documento/cuenta', verificarToken, usuariosController.eliminarCuenta);
};
