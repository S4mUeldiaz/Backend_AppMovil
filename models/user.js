const db = require('../config/config');
const User = {
    create: (user, result) => {
        const sql = `
        INSERT INTO users(
        email,
        name,
        lastname,
        phone,
        image,
        password,
        cretae_at,
        update_at
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
            user.password,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
               }
               else{
                console.log('Id del nuevo Usuario:', res.insertId);
                result(null, res.insertId);
               }
        }
      )
    }
};

module.exports = User;