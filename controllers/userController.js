const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys'); 


module.exports = {

    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async(err, myUser) => {
            if(err) {
                return res.status(501).json({
                    succes: false,
                    message: 'Error al consultar usuario',
                    error: err
                });
            }
            if(!myUser) {
                return res.status(401).json({
                    Suspense: false,
                    message: 'El email no existe en la base de datos'
                }); 
            }
            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if(isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email },
                    keys.secretOrterkey
                );

                const data ={
                    id: myUser.id,
                    email: myUser.email,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    image: myUser.image,
                    phone: myUser.phone,
                    session_token: `JWT ${token}`
                }
                return res.status(200).json({
                    success: true,
                    message: 'Usuario autenticado',
                    data: data
                });
            } else {
                return res.status(401).json({
                    succes: false,
                    message: 'contraseña incorrecta',

                });
            }
        });
    
    },
    
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