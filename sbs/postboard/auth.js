const mysql = require('./mysql-db');
let auth = {};

auth.test = (func) => {
    mysql.query('select * from users', (err, rows) => {
        func(err, rows);
    });
}

auth.login = (id, pw, func) => {
    mysql.query('select * from users where id=? and password=?', [id, pw], (err, rows) => {
        func(err, rows);
    });
};

auth.register = (id, pw, func) => {
    mysql.query('insert into users (id, password) value (?, ?)', [id, pw], func);
}

module.exports = auth;