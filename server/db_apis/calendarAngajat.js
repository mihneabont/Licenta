const database = require("../services/database.js");

const zileSpeciale = ["NEM", "AM", "SIND", "CM", "CO", "COR", "SUSP", "DET", "IFP", "PRB", "REC", "CCM"];

const selecteazaCreateSelectCalendar = `select ID_PONTAJ, to_char(DATA_PONTAJ + 1/12, 'dd/mm/yyyy') as DATA_PONTAJ, PONTAT_REAL, PONTAT_CONFIRMAT, ORA_I, ORA_E 
                            from PONTAJ
                            where ID_SALARIAT = :id_angajat and TO_CHAR(DATA_PONTAJ, 'MM/YYYY') in :luna_an`;

const selecteazaCalendarConfirmat = `select ID_PONTAJ, to_char(DATA_PONTAJ + 1/12, 'dd/mm/yyyy') as DATA_PONTAJ, PONTAT_CONFIRMAT, PONTAT_REAL, ORA_I, ORA_E 
                            from PONTAJ
                            where ID_SALARIAT = :id_angajat and TO_CHAR(DATA_PONTAJ, 'MM/YYYY') in :luna_an and PONTAT_CONFIRMAT IS NOT NULL`;


async function createSelectCalendar(angajat) {
   let query = selecteazaCreateSelectCalendar;
  
   const binds = {};
  if (angajat.id) {
    binds.id_angajat = angajat.id;
    if(angajat.date){
      binds.luna_an = angajat.date;
      console.log(binds);
      const result = await database.simpleExecute(query, binds);
      return result.rows;
    } else {
      return null;
    }
  } else {
    return null;
  }
} 

async function createSelectCalendarConfirmat(angajat) {
  let query = selecteazaCalendarConfirmat;
 
  const binds = {};
 if (angajat.id) {
   binds.id_angajat = angajat.id;
   if(angajat.date){
     binds.luna_an = angajat.date;
     console.log(binds);
     const result = await database.simpleExecute(query, binds);
     return result.rows;
   } else {
     return null;
   }
 } else {
   return null;
 }
} 

async function updateSuperAdmin(id, requestBody) {
  for(i in requestBody) {
    let query = `select * from PONTAJ
                where ID_SALARIAT = ${id} and DATA_PONTAJ = TO_DATE('${requestBody[i].DATA_PONTAJ}', 'DD-MM-YYYY') `;
    const result = await database.simpleExecute(query, {});
    
    if(result.rows.length === 0){
      //insert
      let queryInsert = `INSERT INTO PONTAJ VALUES(NVL((select max(ID_PONTAJ) + 1 from PONTAJ),1),
                          ${id}, TO_DATE('${requestBody[i].DATA_PONTAJ}', 'DD-MM-YYYY'), '${requestBody[i].PONTAT_REAL}',null,
                          '${requestBody[i].ORA_I}', '${requestBody[i].ORA_E}', sysdate, 5)`;
      const insert = await database.simpleExecute(queryInsert, {});
      console.log(insert.rowsAffected);
    } else if(result.rows.length === 1){
      //update
      let queryUpdate = `UPDATE PONTAJ SET
                          ORA_I = '${requestBody[i].ORA_I}',
                          ORA_E = '${requestBody[i].ORA_E}',
                          PONTAT_REAL = '${requestBody[i].PONTAT_REAL}'
                          WHERE ID_PONTAJ = ${result.rows[0].ID_PONTAJ}`;
      const updateRes = await database.simpleExecute(queryUpdate, {});
      console.log(updateRes.rowsAffected);
    } else {
      //eroare
      return null;
    }
  }

}

async function updateAdmin(id, requestBody) {
  for(i in requestBody) {
    let query = `select * from PONTAJ
                where ID_SALARIAT = ${id} and DATA_PONTAJ = TO_DATE('${requestBody[i].DATA_PONTAJ}', 'DD-MM-YYYY') `;
    const result = await database.simpleExecute(query, {});
    
    if(result.rows.length === 0){
      if(zileSpeciale.indexOf(requestBody[i].ORA_I) > -1){
        //insert
        let queryInsert = `INSERT INTO PONTAJ VALUES(NVL((select max(ID_PONTAJ) + 1 from PONTAJ),1),
                            ${id}, TO_DATE('${requestBody[i].DATA_PONTAJ}', 'DD-MM-YYYY'), null,null,
                            '${requestBody[i].ORA_I}', '${requestBody[i].ORA_E}', sysdate, 5)`;
        const insert = await database.simpleExecute(queryInsert, {});
        console.log(insert.rowsAffected);
      }
    } else if(result.rows.length === 1){
      if(zileSpeciale.indexOf(requestBody[i].ORA_I) > -1){
        //update
        let queryUpdate = `UPDATE PONTAJ SET
                        ORA_I = '${requestBody[i].ORA_I}',
                        ORA_E = '${requestBody[i].ORA_I}',
                        PONTAT_REAL = null
                        WHERE ID_PONTAJ = ${result.rows[0].ID_PONTAJ}`;
        const updateRes = await database.simpleExecute(queryUpdate, {});
        console.log(updateRes.rowsAffected);
      }
    } else {
      //eroare
      return null;
    }
  }

}

module.exports = {
  createSelectCalendar: createSelectCalendar,
  createSelectCalendarConfirmat: createSelectCalendarConfirmat,
  updateSuperAdmin: updateSuperAdmin,
  updateAdmin: updateAdmin
};