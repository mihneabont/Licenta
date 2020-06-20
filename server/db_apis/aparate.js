const database = require("../services/database.js");

const gasesteAngajatCartela = `SELECT ID_SALARIAT FROM N_CARTELE WHERE COD_CARTELA = :codCartela`;


async function getAngajatCuCod(codCartela) {
    let query = gasesteAngajatCartela;
    const binds = {codCartela: codCartela};
    const result = await database.simpleExecute(query,binds);

    return result.rows;
}

module.exports = {
    getAngajatCuCod: getAngajatCuCod,
};