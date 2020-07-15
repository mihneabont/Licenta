const database = require("../services/database.js");
const oracledb = require("oracledb");

const selecteazaAngajati = `select n.ID_SALARIAT, NUME, PRENUME, n.DATA_INCEP,(SELECT MARCA FROM MARCA WHERE n.ID_SALARIAT=ID_SALARIAT ORDER BY DATA_INCEP DESC FETCH NEXT 1 ROWS ONLY) AS MARCA
from NUME_SALARIAT n order by NUME,PRENUME`;

const selecteazaAngajatiParticular = `select DISTINCT n.ID_SALARIAT, NUME, PRENUME, (SELECT MARCA FROM MARCA WHERE n.ID_SALARIAT=ID_SALARIAT ORDER BY DATA_INCEP DESC FETCH NEXT 1 ROWS ONLY) AS MARCA, CNP, s.DATA_INCEP +1/2 as DATA_INCEP, s.DATA_IES +1/2 as DATA_IES, s.DATA_ADAUGARE +2/24 AS DATA_ORA_OPER,
(select COD_CARTELA from N_CARTELE where ID_SALARIAT=:id_angajat and DATA_IES IS NULL and DATA_INCEP IS NOT NULL) AS COD_CARTELA, d.ID_N_JUDET, d.ID_N_LOCATIE, d.ID_N_DEPART
        from NUME_SALARIAT n,SALARIAT s, DEPART_SALARIAT d
        where n.ID_SALARIAT = s.ID_SALARIAT and n.ID_SALARIAT = d.ID_SALARIAT
        and s.ID_SALARIAT = :id_angajat`;

const insertAngajatSql = `INSERT ALL
                         INTO SALARIAT(ID_SALARIAT, CNP, DATA_INCEP, DATA_IES,DATA_ADAUGARE) VALUES (:id_angajat, :cnp, :data_inceput, :data_sfarsit, sysdate )
                         INTO DATA_ANGAJARE(ID_DATA_ANGAJARE, ID_SALARIAT, DATA_ANGAJARE, DATA_PLECARE) VALUES (NVL((select max(ID_DATA_ANGAJARE)+1 from DATA_ANGAJARE),1),:id_angajat, :data_inceput, :data_sfarsit)
                         INTO NUME_SALARIAT(ID_NUME_SALARIAT, ID_SALARIAT, NUME, PRENUME, DATA_INCEP, DATA_IES) VALUES (NVL((select max(ID_NUME_SALARIAT)+1 from NUME_SALARIAT),1), :id_angajat, :nume, :prenume, :data_inceput, :data_sfarsit)
                         INTO DEPART_SALARIAT(ID_DEPART_SALARIAT, ID_SALARIAT, ID_N_JUDET, ID_N_LOCATIE, ID_N_DEPART) VALUES (NVL((select max(ID_DEPART_SALARIAT)+1 from DEPART_SALARIAT),1), :id_angajat, :judet, :locatia, :departament)
                         INTO MARCA(ID_MARCA, ID_SALARIAT, MARCA, DATA_INCEP, DATA_IES) VALUES (NVL((select max(ID_MARCA)+1 from MARCA),1), :id_angajat, :marca, :data_inceput, :data_sfarsit)
                         INTO N_CARTELE(ID_N_CARTELE, ID_SALARIAT, COD_CARTELA, DATA_INCEP, DATA_IES) VALUES (NVL((select max(ID_N_CARTELE)+1 from N_CARTELE),1), :id_angajat, :cod_cartela, :data_inceput, :data_sfarsit)
                         SELECT 1 FROM dual`;

async function createselecteazaAngajati(angajat) {
  let query = selecteazaAngajati;
  let querrySelecteazaAngajatiParticular = selecteazaAngajatiParticular;
  const binds = {};
  if (angajat.id) {
    binds.id_angajat = angajat.id;
    query = querrySelecteazaAngajatiParticular;
  }

  const result = await database.simpleExecute(query, binds);

  if (result.rows && result.rows[0]) {
    if (angajat.id) {
      if (result.rows[0].ID_N_JUDET !== null) {
        const binds = {};
        binds.judet = result.rows[0].ID_N_JUDET;
        const result2 = await database.simpleExecute(
          `select JUDET from N_JUDET where :judet = ID_N_JUDET`,
          binds
        );
        result.rows[0]["JUDET"] = result2.rows[0].JUDET;
      } else {
        result.rows[0]["JUDET"] = null;
      }

      if (result.rows[0].ID_N_LOCATIE !== null) {
        const binds = {};
        binds.locatia = result.rows[0].ID_N_LOCATIE;
        const result2 = await database.simpleExecute(
          `select LOCATIA from N_LOCATIE where :locatia = ID_N_LOCATIE`,
          binds
        );
        result.rows[0]["LOCATIA"] = result2.rows[0].LOCATIA;
      } else {
        result.rows[0]["LOCATIA"] = null;
      }

      if (result.rows[0].ID_N_DEPART !== null) {
        const result2 = await database.simpleExecute(
          `select NUME_DEPART, NUME_LUNG from N_NUME_DEPART where :departament = ID_N_DEPART`,
          { departament: result.rows[0].ID_N_DEPART }
        );
        if (result2.rows[0]) {
          result.rows[0]["NUME_DEPART"] = result2.rows[0].NUME_DEPART;
          result.rows[0]["NUME_DEPART_LUNG"] = result2.rows[0].NUME_LUNG;
        }
      } else {
        result.rows[0]["NUME_DEPART"] = null;
        result.rows[0]["NUME_DEPART_LUNG"] = null;
      }

      (result.rows[0]);

      return [result.rows[0]];
    }
    return result.rows;
  } else {
    return null;
  }
}

async function insertAngajat(angajat) {
  if (angajat.nume) {
    let query = insertAngajatSql;
    const binds = {};
    const id_next_salariat = await database.simpleExecute(
      "select max(ID_SALARIAT)+1 as id from SALARIAT",
      binds
    );

    if (id_next_salariat.rows[0].ID === null) {
      binds.id_angajat = 1;
    } else {
      binds.id_angajat = id_next_salariat.rows[0].ID;
    }

    binds.nume = angajat.nume;
    binds.prenume = angajat.prenume;
    binds.marca = angajat.marca;
    binds.cnp = angajat.cnp;
    binds.data_inceput = angajat.data_inceput;
    binds.data_sfarsit = angajat.data_sfarsit;
    binds.judet = angajat.judet;
    binds.locatia = angajat.locatia;
    binds.departament = angajat.departament;
    binds.cod_cartela = angajat.cod_cartela;

    const result = await database.simpleExecute(query, binds);

    if (result.rowsAffected && result.rowsAffected >= 1) {
      return result.rowsAffected;
    } else {
      return null;
    }
  }
}

async function update(angajat) {
  const objAng = Object.assign({}, angajat);

  const update_salariat = `UPDATE SALARIAT SET
                            "CNP" = ${objAng.cnp},
                            "DATA_INCEP" = '${objAng.data_inceput}',
                            "DATA_IES" = '${objAng.data_sfarsit}'
                          where ID_SALARIAT = ${objAng.id_angajat}`;

  const update_data_ang = `UPDATE DATA_ANGAJARE SET
                          DATA_ANGAJARE = '${objAng.data_inceput}',
                          DATA_PLECARE = '${objAng.data_sfarsit}'
                        where ID_SALARIAT = ${objAng.id_angajat}`;

  const update_nume_salariat = `UPDATE NUME_SALARIAT SET
                          NUME = '${objAng.nume}',
                          PRENUME = '${objAng.prenume}',
                          DATA_INCEP = '${objAng.data_inceput}',
                          DATA_IES = '${objAng.data_sfarsit}'
                        where ID_SALARIAT = ${objAng.id_angajat}`;

  const update_depart_salar = `UPDATE DEPART_SALARIAT SET
                          ID_N_JUDET = ${objAng.judet},
                          ID_N_LOCATIE = ${objAng.locatia},
                          ID_N_DEPART = ${objAng.departament}
                        where ID_SALARIAT = ${objAng.id_angajat}`;

  const update_marca = `UPDATE MARCA SET
                        MARCA = ${objAng.marca},
                        DATA_INCEP = '${objAng.data_inceput}',
                        DATA_IES = '${objAng.data_sfarsit}'
                      where ID_SALARIAT = ${objAng.id_angajat}`;

        
  const update_cartele = `MERGE INTO N_CARTELE USING dual ON ( "ID_SALARIAT"=${objAng.id_angajat} )
                          WHEN MATCHED THEN UPDATE SET "COD_CARTELA"= '${objAng.cod_cartela}', "DATA_INCEP" = sysdate
                          WHEN NOT MATCHED THEN INSERT ("ID_N_CARTELE","ID_SALARIAT","COD_CARTELA") 
                              VALUES ( NVL((select max(ID_N_CARTELE)+1 from N_CARTELE),1),'${objAng.id_angajat}', '${objAng.cod_cartela}' )`;

  if (objAng.id_angajat) {
    let query = update_salariat;
    const result = await database.simpleExecute(query, {});
    if (result.rowsAffected !== 0) {
      let query = update_data_ang;
      const result = await database.simpleExecute(query, {});
      if (result.rowsAffected !== 0) {
        let query = update_nume_salariat;
        const result = await database.simpleExecute(query, {});
        if (result.rowsAffected !== 0) {
          let query = update_depart_salar;
          const result = await database.simpleExecute(query, {});
          if (result.rowsAffected !== 0) {
            let query = update_marca;
            const result = await database.simpleExecute(query, {});
            if (result.rowsAffected !== 0) {
              let query = update_cartele;
              const result = await database.simpleExecute(query, {});
              if (result.rowsAffected !== 0) {
                return objAng;
              } else {
                return null;
              }
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const deleteSql = `begin
 
    delete from N_CARTELE
    where ID_SALARIAT = :employee_id;
 
    delete from MARCA
    where ID_SALARIAT = :employee_id;

    delete from SALARIAT
    where ID_SALARIAT = :employee_id;

    delete from NUME_SALARIAT
    where ID_SALARIAT = :employee_id;

    delete from DEPART_SALARIAT
    where ID_SALARIAT = :employee_id;

    delete from DATA_ANGAJARE
    where ID_SALARIAT = :employee_id;
 
    :rowcount := sql%rowcount;
 
  end;`;

async function del(id) {
  const binds = {
    employee_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  };
  const result = await database.simpleExecute(deleteSql, binds);

  return result.outBinds.rowcount > 0;
}

module.exports = {
  createselecteazaAngajati: createselecteazaAngajati,
  insertAngajat: insertAngajat,
  update: update,
  delete: del
};
