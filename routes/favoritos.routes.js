const favoritosController = require('../controllers/favoritos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/api/favoritos/:numero_documento', verificarToken, favoritosController.obtenerFavoritos);
    app.post('/api/favoritos', verificarToken, favoritosController.agregarFavorito);
    app.delete('/api/favoritos/:numero_documento/:id_producto', verificarToken, favoritosController.eliminarFavorito);
};