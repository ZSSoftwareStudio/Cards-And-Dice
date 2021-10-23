const mysql = require("mysql2/promise");

const db = {
  user: "root",
  password: "",
  port: 3306,
  host: "localhost",
  database: "Cards-and-Dice",
};

async function query(sql, params) {
  const connection = await mysql.createConnection(db);
  const [results] = await connection.execute(sql, params);

  return results;
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

module.exports = {
  query,
  emptyOrRows,
};
