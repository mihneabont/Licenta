const database = require("../services/database.js");

const baseQuery = `select *
  from evenimente`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.id_evenimente = context.id;
    query += `\nwhere id_evenimente = :id_evenimente`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
