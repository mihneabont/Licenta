const oracledb = require("oracledb");
const dbConfig = require("../config/database.js");

async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          (err);
        }
      }
    }
  });
}

function simpleExecuteWithConn(conn, statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
    try {
      const result = await conn.execute(statement, binds, opts);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  simpleExecute: simpleExecute,
  initialize: initialize,
  simpleExecuteWithConn: simpleExecuteWithConn
};