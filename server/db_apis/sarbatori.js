const database = require("../services/database.js");

const selecteazaSarbatori = `select * FROM SARBATORI ORDER BY DATA DESC`;

const insertSarbatoareSql = `INSERT INTO SARBATORI(IDSARBATOARE, DATA) VALUES (:id_sarbatoare, TO_DATE(:data_sarbatoare, 'YYYY-MM-DD') +  1)` 


async function getSarbatori() {
    let query = selecteazaSarbatori;
    
    const result = await database.simpleExecute(query);

    return result.rows;
}

async function insertSarbatoare(date) {
    let query = insertSarbatoareSql;
    const binds = {};
    const id_next_salariat = await database.simpleExecute(
        "select max(IDSARBATOARE)+1 as id from SARBATORI"
      );
  
      if (id_next_salariat.rows[0].ID === null) {
        binds.id_sarbatoare = 1;
      } else {
        binds.id_sarbatoare = id_next_salariat.rows[0].ID;
      }
    binds.data_sarbatoare = date;
    const result = await database.simpleExecute(query, binds);
    if (result.rowsAffected && result.rowsAffected >= 1) {
        return result.rowsAffected;
      } else {
        return null;
      }
}

module.exports = {
    getSarbatori: getSarbatori,
    insertSarbatoare:insertSarbatoare
};
    