const Product = require('../models/product');

module.exports = {

    getAll(req, res) {
        Product.findAll((err, products) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar productos',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Productos consultados',
                data: products
            });
        });
    },

    getById(req, res) {
        const id = req.params.id;

        Product.findById(id, (err, product) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar producto',
                    error: err
                });
            }
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'El producto no existe'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Producto consultado',
                data: product
            });
        });
    },

    create(req, res) {
        const product = req.body;

        Product.create(product, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear el producto',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Producto creado',
                data: data
            });
        });
    },

    update(req, res) {
        const id = req.params.id;
        const product = req.body;

        Product.update(id, product, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el producto',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Producto actualizado',
                data: data
            });
        });
    },

    remove(req, res) {
        const id = req.params.id;

        Product.remove(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al eliminar el producto',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Producto eliminado',
                data: data
            });
        });
    }
};
