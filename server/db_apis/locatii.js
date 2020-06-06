const database = require("../services/database.js");

const selecteazaAngajatiDinLocatie = `select DISTINCT n.ID_SALARIAT, NUME, PRENUME, MARCA
                from NUME_SALARIAT n LEFT JOIN MARCA m ON n.ID_SALARIAT = m.ID_SALARIAT
                LEFT JOIN DEPART_SALARIAT d ON n.ID_SALARIAT=d.ID_SALARIAT where d.ID_N_LOCATIE = :id_locatie and n.DATA_IES IS NULL order by NUME, PRENUME`;


async function getAngajatiDinLocatie(locatie) {
    let query;
    const binds = {};
    if (locatie.id) {
        binds.id_locatie= locatie.id;
        query = selecteazaAngajatiDinLocatie;
    }
    
    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports = {
    getAngajatiDinLocatie: getAngajatiDinLocatie
};
    