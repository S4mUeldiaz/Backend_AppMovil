const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/api/auth/registro', authController.registro);
    app.post('/api/auth/login', authController.login);
    app.post('/api/auth/logout', authController.logout);
    app.get('/api/auth/yo', verificarToken, authController.yo);
};