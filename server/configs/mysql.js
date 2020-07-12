const mysql = require('mysql')

let db = mysql.createConnection({ 
host     : '139.5.147.154', 
user     : 'robot',
password : 'robot@2020',
database : 'robot'
})

db.connect()

module.exports = db