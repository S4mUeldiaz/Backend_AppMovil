const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_base1'
});

db.connect(function(err){
    if(err) throw err;
    console.log('base de datos conectada');

});

module.exports = db;
