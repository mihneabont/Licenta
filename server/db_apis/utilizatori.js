const database = require("../services/database.js");
const bcrypt = require("bcryptjs");

const selecteazaUtilizator = `select * from UTILIZATORI`;

const selecteazaUtilizator2 = `select ID_UTILIZATOR, NUME_UTILIZATOR, PAROLA, ADMIN, ID_N_JUDET, u.ID_SALARIAT from UTILIZATORI u left join DEPART_SALARIAT d on u.ID_SALARIAT = d.ID_SALARIAT`;

const selecteazaUtilizator3 = `select PAROLA from UTILIZATORI where ID_UTILIZATOR = :id_utilizator`;

const selecteazaLocatie = `select ID_N_JUDET, ID_N_LOCATIE from DEPART_SALARIAT where ID_SALARIAT = :idSalariat`;

const updateUtilizator = `update UTILIZATORI set PAROLA = :parola_noua where ID_UTILIZATOR = :id_utilizator`;


async function getLocatieUtilizator(idUtilizator){
  let query = selecteazaLocatie;
  const binds = {idSalariat: idUtilizator};
  const result = await database.simpleExecute(query, binds);
  return result.rows;
}

async function createSelecteazaUtilizator(utilizator) {
  if (utilizator.nume_utilizator) {
    let query = selecteazaUtilizator2;
    const binds = {};
    binds.nume_utilizator = utilizator.nume_utilizator;
    query += `\nwhere NUME_UTILIZATOR = :nume_utilizator`;
    const result = await database.simpleExecute(query, binds);
    return result.rows;
  }
}

async function schimbaParola(utilizator) {
  if (utilizator.idUtilizator) {
    let query = selecteazaUtilizator3;
    const binds = {};
    binds.id_utilizator = utilizator.idUtilizator;
    (binds);
    const result = await database.simpleExecute(query, binds);
    binds.parola_actuala = utilizator.parolaActuala;
    if(result.rows[0].PAROLA) {
      const rez = bcrypt.compare(utilizator.parolaActuala, result.rows[0].PAROLA).then(function(res) {
        (result.rows[0].PAROLA)   
        if(res == true || utilizator.parolaActuala === result.rows[0].PAROLA) {
          bcrypt.hash(utilizator.parolaNoua, 10).then( async function(hash) {
            (hash);
            let querryUpdate = updateUtilizator;
            let binds ={};
            binds.parola_noua = hash;
            binds.id_utilizator = utilizator.idUtilizator;
            const updateResult = await database.simpleExecute(querryUpdate, binds);
            
          });
          
          return `Success`;
        } else {
          return `Wrong password`;
        }
    });
    return rez;
    }
    return null;
   
  }
}

module.exports ={
  createSelecteazaUtilizator: createSelecteazaUtilizator,
  schimbaParola: schimbaParola,
  getLocatieUtilizator: getLocatieUtilizator
};
