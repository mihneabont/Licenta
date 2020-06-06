const database = require("../services/database.js");

const selecteazaDepartamente = `select ID_N_DEPART, NUME_DEPART, NUME_LUNG, TIP_DEPART
                            from N_NUME_DEPART d, N_TIP_DEPART t
                            where d.ID_N_TIP_DEPART = t.ID_N_TIP_DEPART order by NUME_DEPART`;

const querrySelecteazaAngajatiDinDepartament = `select n.ID_SALARIAT, NUME, PRENUME, MARCA
            from NUME_SALARIAT n, MARCA m, DEPART_SALARIAT d
            where n.ID_SALARIAT = m.ID_SALARIAT and d.ID_SALARIAT = n.ID_SALARIAT
            and d.ID_N_DEPART = :id_dep and d.ID_N_LOCATIE = :id_loc and n.DATA_IES IS NULL order by NUME,PRENUME
            `;

const querrySelecteazaDepartamentDupaLocatie = `select NUME_DEPART,ID_N_DEPART from N_NUME_DEPART where ID_N_DEPART in (select DISTINCT ID_N_DEPART from DEPART_SALARIAT where ID_N_LOCATIE= :id_loc) order by NUME_DEPART`;

          
async function createSelecteazaDepartamente(dep) {
    let query = selecteazaDepartamente;
    const binds = {};
    if (dep.id_dep && dep.id_loc) {
      binds.id_dep= dep.id_dep;
      binds.id_loc= dep.id_loc;
      query = querrySelecteazaAngajatiDinDepartament;
    }
    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

async function selecteazaDepartamentDupaLocatie(locatia) {
  let query;
  const binds = {};
  if (locatia.id) {
    binds.id_loc= locatia.id;
    query = querrySelecteazaDepartamentDupaLocatie;
    const result = await database.simpleExecute(query, binds);
    return result.rows;
  }

  return null;
}


module.exports = {
  createSelecteazaDepartamente: createSelecteazaDepartamente,
  selecteazaDepartamentDupaLocatie: selecteazaDepartamentDupaLocatie
  };
  