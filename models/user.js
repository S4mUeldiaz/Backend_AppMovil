const { use } = require('passport');
const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.findById = (id, result) => {
    const sql = 'SELECT id, email, name , lastname, image, password FROM WHERE id = ?';

    db.query(sql, 
        [id],(err,user) => {
            if (err) {
              console.log('Error al consultar: ', err);
              result(err,null);
            }else{
              console.log('Usuario consultado: ', user[0]);
              result(null, user[0]);
            }
        }
    );
}

User.findByEmail = (email, result) => {
    const sql = 'SELECT id, email, name , lastname, image, phone, password FROM WHERE email = ?';
    
    db.query(sql, 
        [email],(err,user) => {
            if (err) {
              console.log('Error al consultar: ', err);
             result(err,null);
           }else{
              console.log('Usuario consultado: ', user[0]);
              result(null, user[0]);
           }
        }
    );
}










    User.create = async(user, result) => {
        const hash = await bcrypt.hash(user.password,10);
        const sql = `
        INSERT INTO users(
            email,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.query(
                sql,
                [
                    user.email,
                    user.name,
                    user.lastname,
                    user.phone,
                    user.image,
                    hash,
                    new Date(),
                    new Date()
                ],
                (err, res) => {
                    if (err) {
                        console.log('Error al crer usuario: ', err);
                        result(err, null);
                    }
                    else{
                        console.log('Usuario creado: ',{ id: res.insertId, ...User }); 
                        result(null, {id: res.insertId, ...User});
                    }
                }
            )
        };
        
        module.exports = User;