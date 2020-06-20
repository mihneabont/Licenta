const database = require("../services/database.js");

const gasesteAngajatCartela = `SELECT ID_SALARIAT FROM N_CARTELE WHERE COD_CARTELA = :codCartela`;

const selectAparatMAC = `SELECT * FROM APARATE WHERE ADRESA_MAC = :adresaMAC`;

const insertAparat = 'INSERT INTO APARATE(ID_APARAT, ADRESA_MAC, ULTIMA_PORNIRE) VALUES (NVL((select max(ID_APARAT) +1 from APARATE),1), :adresaMAC, sysdate )';

const updateAparat = 'UPDATE APARATE SET ULTIMA_PORNIRE = sysdate WHERE ADRESA_MAC = :adresaMAC'

async function getAngajatCuCod(codCartela) {
    let query = gasesteAngajatCartela;
    const binds = {codCartela: codCartela};
    const result = await database.simpleExecute(query,binds);

    return result.rows;
}

async function insertOraScanata(id) {
    let query = gasesteAngajatCartela;
    const binds = {codCartela: codCartela};
    const result = await database.simpleExecute(query,binds);

    return result.rows;
}

async function registerAparat(adresaMAC) {
    let query = selectAparatMAC;
    const binds = {adresaMAC: adresaMAC};
    const result = await database.simpleExecute(query,binds);
    var queryResult = null;
    if(result.rows.length === 0){
        queryResult = await database.simpleExecute(insertAparat,binds);
    } else {
        queryResult = await database.simpleExecute(updateAparat,binds);
    }
    return queryResult;
}

module.exports = {
    getAngajatCuCod: getAngajatCuCod,
    registerAparat: registerAparat
};