const database = require("../services/database.js");

const selecteazaAngajatiParticular = `select MARCA, da.DATA_ANGAJARE +1/2 as DATA_ANGAJARE, da.DATA_PLECARE +1/2 as DATA_PLECARE, (select COD_CARTELA from N_CARTELE where ID_SALARIAT = :id_angajat and DATA_IES IS NULL) as COD_CARTELA
                            from MARCA m, DATA_ANGAJARE da
                            where da.ID_SALARIAT = m.ID_SALARIAT 
                            and da.ID_SALARIAT = :id_angajat`;

async function createselecteazaAngajatiPublic(angajat) {
   let query = selecteazaAngajatiParticular;
  
   const binds = {};
  if (angajat.id) {
    binds.id_angajat = angajat.id;
    const result = await database.simpleExecute(query, binds);
    return result.rows[0];
  } else {
    return null;
  }
} 

module.exports = {
  createselecteazaAngajatiPublic: createselecteazaAngajatiPublic
};