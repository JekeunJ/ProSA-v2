const mysql = require('mysql2/promise');

async function connect() {
  const connection = await mysql.createConnection({
    host: process.env.GOOGLE_SQL_IP,
    user: process.env.GOOGLE_SQL_DB_USER,
    password: process.env.GOOGLE_SQL_DB_PASSWORD,
    database: process.env.GOOGLE_SQL_DB_NAME,
  });

  return connection;
}

module.exports = connect;
