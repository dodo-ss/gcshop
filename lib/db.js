var mysql = require('mysql');
var db =
mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '741ASD741ASD',
    database : 'webdb2026'
})
db.connect();
module.exports = db