const User = require('../models/user');

module.exports = {
    register(req, res) {
        const user = req.body;
        User.create(user, (err,data) => {
            if (err) {
                return res.status(501).json({
                    succes: false,
                    message: 'error al crear el usuario',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Creado el usuario',
                data: data //Id dl Usuario Creado
            });
        });
    }

};