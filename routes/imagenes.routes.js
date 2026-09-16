const multer = require('multer');
const imagenesController = require('../controllers/imagenes.controller');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (app) => {
    app.get('/api/imagenes/producto/:id_producto', imagenesController.obtenerImagenesPorProducto);
    app.post('/api/imagenes', upload.single('file'), imagenesController.subirImagen);
    app.delete('/api/imagenes/:id_imagen', imagenesController.eliminarImagen);
};