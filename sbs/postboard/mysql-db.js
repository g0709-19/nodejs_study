const mysql = require('mysql');
const db_config  = require('./config/db-config.json');
const connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  database : db_config.database
});

module.exports = connection;