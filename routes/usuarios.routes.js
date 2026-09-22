const usuariosController = require('../controllers/usuarios.controller');
const { verificarToken, verificarRol, verificarPropioOAdmin } = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/api/usuarios', verificarToken, verificarRol('admin'), usuariosController.obtenerUsuarios);
    app.patch('/api/usuarios/:numero_documento/estado', verificarToken, verificarRol('admin'), usuariosController.cambiarEstadoUsuario);
    app.put('/api/usuarios/:numero_documento', verificarToken, verificarPropioOAdmin, usuariosController.actualizarUsuario);
    app.patch('/api/usuarios/:numero_documento/password', verificarToken, verificarPropioOAdmin, usuariosController.cambiarPassword);
    app.delete('/api/usuarios/:numero_documento/cuenta', verificarToken, verificarPropioOAdmin, usuariosController.eliminarCuenta);
};
