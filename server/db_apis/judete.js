const database = require("../services/database.js");

const selecteazaJudete = `select ID_N_JUDET, JUDET
                            from N_JUDET
                            ORDER BY JUDET`;

//const selecteazaJudeteParticular2 = `select listagg(LOCATIA, ', ') WITHIN GROUP (ORDER BY LOCATIA) "LOCATII", JUDET
 //                           from N_LOCATIE l, N_JUDET j
  //                          where l.ID_N_JUDET = :id_judet and j.ID_N_JUDET = l.ID_N_JUDET
   //                         group by JUDET`;                        

const selecteazaJudeteParticular = `select LOCATIA, l.ID_N_LOCATIE
                            from N_LOCATIE l, N_JUDET j
                            where l.ID_N_JUDET = :id_judet and j.ID_N_JUDET = l.ID_N_JUDET order by LOCATIA`;

async function createselecteazaJudete(judet) {
    let query = selecteazaJudete;
    let querrySelecteazaJudeteParticular = selecteazaJudeteParticular;
    const binds = {};
  
    //returneaza compartimentele din judet
    if (judet.id) {
      binds.id_judet = judet.id;
      query = querrySelecteazaJudeteParticular;
    }
  
    const result = await database.simpleExecute(query, binds);

    return result.rows;
}



module.exports = {
    createselecteazaJudete: createselecteazaJudete
  };
  