async function query(sql, params, connection) {
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
