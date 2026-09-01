const db = require('../config/config');

const Product = {};

Product.findAll = (result) => {
    const sql = 'SELECT id, name, price, created_at, updated_at FROM products';

    db.query(sql, (err, products) => {
        if (err) {
            console.log('Error al consultar productos: ', err);
            result(err, null);
        } else {
            result(null, products);
        }
    });
}

Product.findById = (id, result) => {
    const sql = 'SELECT id, name, price, created_at, updated_at FROM products WHERE id = ?';

    db.query(sql, [id], (err, products) => {
        if (err) {
            console.log('Error al consultar producto: ', err);
            result(err, null);
        } else {
            result(null, products[0]);
        }
    });
}

Product.create = (product, result) => {
    const sql = `
    INSERT INTO products(
        name,
        price,
        created_at,
        updated_at
        )
        VALUES (?, ?, ?, ?)`;

    db.query(
        sql,
        [
            product.name,
            product.price,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error al crear producto: ', err);
                result(err, null);
            } else {
                result(null, { id: res.insertId, name: product.name, price: product.price });
            }
        }
    );
}

Product.update = (id, product, result) => {
    const sql = 'UPDATE products SET name = ?, price = ?, updated_at = ? WHERE id = ?';

    db.query(
        sql,
        [product.name, product.price, new Date(), id],
        (err, res) => {
            if (err) {
                console.log('Error al actualizar producto: ', err);
                result(err, null);
            } else {
                result(null, { id: id, name: product.name, price: product.price });
            }
        }
    );
}

Product.remove = (id, result) => {
    const sql = 'DELETE FROM products WHERE id = ?';

    db.query(sql, [id], (err, res) => {
        if (err) {
            console.log('Error al eliminar producto: ', err);
            result(err, null);
        } else {
            result(null, { id: id });
        }
    });
}

module.exports = Product;
