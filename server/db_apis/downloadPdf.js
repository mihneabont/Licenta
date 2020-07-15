const database = require("../services/database.js");

// const querry1 = `select n.ID_SALARIAT, NUME, PRENUME, MARCA, p.ID_PONTAJ, to_char(p.DATA_PONTAJ + 1/12, 'dd/mm/yyyy') as DATA_PONTAJ, p.PONTAT_REAL, p.PONTAT_CONFIRMAT, p.ORA_I, p.ORA_E, nd.NUME_LUNG
//   from NUME_SALARIAT n, MARCA m, DEPART_SALARIAT d, PONTAJ p, N_NUME_DEPART nd
//         where n.ID_SALARIAT = m.ID_SALARIAT and d.ID_SALARIAT = n.ID_SALARIAT and p.ID_SALARIAT = n.ID_SALARIAT and nd.ID_N_DEPART = :id_dep
//         and d.ID_N_DEPART = :id_dep and p.DATA_PONTAJ >= to_date(:limita1,'DD/MM/YYYY') and p.DATA_PONTAJ <= to_date(:limita2,'DD/MM/YYYY')  order by n.ID_SALARIAT`;
        
const querry2 = `select DISTINCT n.ID_SALARIAT, NUME, PRENUME, (SELECT MARCA FROM MARCA WHERE n.ID_SALARIAT=ID_SALARIAT ORDER BY DATA_INCEP DESC FETCH NEXT 1 ROWS ONLY) AS MARCA, nd.NUME_LUNG
  from NUME_SALARIAT n, DEPART_SALARIAT d, N_NUME_DEPART nd
        where d.ID_SALARIAT = n.ID_SALARIAT and nd.ID_N_DEPART = :id_dep
        and d.ID_N_DEPART = :id_dep order by NUME, PRENUME`;
          
const querryLocatie = `select DISTINCT n.ID_SALARIAT, NUME, PRENUME, (SELECT MARCA FROM MARCA WHERE n.ID_SALARIAT=ID_SALARIAT ORDER BY DATA_INCEP DESC FETCH NEXT 1 ROWS ONLY) AS MARCA
      from NUME_SALARIAT n, DEPART_SALARIAT d
      where d.ID_SALARIAT = n.ID_SALARIAT AND n.DATA_IES IS NULL and d.ID_N_LOCATIE = :id_loc order by NUME, PRENUME`;

const querryLocatieDepart = `select DISTINCT n.ID_SALARIAT, NUME, PRENUME, (SELECT MARCA FROM MARCA WHERE n.ID_SALARIAT=ID_SALARIAT ORDER BY DATA_INCEP DESC FETCH NEXT 1 ROWS ONLY) AS MARCA
from NUME_SALARIAT n, DEPART_SALARIAT d
where d.ID_SALARIAT = n.ID_SALARIAT AND n.DATA_IES IS NULL and d.ID_N_DEPART = :id_dep and d.ID_N_LOCATIE = :id_loc order by NUME, PRENUME`;

          
async function genereazaPdf(dep) {
  
    let query = querry2;
    
   const binds = {};
  if (dep.id) {
    binds.id_dep = dep.id;
    
    if(dep.date){
      const result = await database.simpleExecute(query, binds);
      if(result.rows === [] || result.rows === null){
        return null;
      }

      const randuri = [];
      for(let i=0;i<result.rows.length;i++) {
        let angajat = {};
        
        angajat.ID_SALARIAT = result.rows[i].ID_SALARIAT;
        angajat.NUME = result.rows[i].NUME;
        angajat.PRENUME = result.rows[i].PRENUME;
        angajat.MARCA = result.rows[i].MARCA;
        angajat.NUME_LUNG = result.rows[i].NUME_LUNG;
        angajat.PONTAJE = [];
        
        const binds2 = {};
        
        binds2.id_sal = angajat.ID_SALARIAT;
        binds2.limita1 = dep.limita1;
    		binds2.limita2 = dep.limita2;
        try{
          const getPontaje =  await database.simpleExecute(`select ID_PONTAJ, to_char(DATA_PONTAJ + 1/12, 'dd/mm/yyyy') as DATA_PONTAJ, PONTAT_REAL, PONTAT_CONFIRMAT, ORA_I, ORA_E
          from PONTAJ where DATA_PONTAJ >= to_date(:limita1,'DD/MM/YYYY') and DATA_PONTAJ <= to_date(:limita2,'DD/MM/YYYY')	and ID_SALARIAT = :id_sal`, binds2);                                
          if(getPontaje.rows !== null && getPontaje.rows !== []) {
            
            // ("hellau " + angajat.ID_SALARIAT);
            // (getPontaje.rows);
            for(let k=0;k<getPontaje.rows.length;k++) {
              let ziPontaj = {};
              if(getPontaje.rows[k] !== null) {

              ziPontaj.DATA_PONTAJ = getPontaje.rows[k].DATA_PONTAJ;
              ziPontaj.ID_PONTAJ = getPontaje.rows[k].ID_PONTAJ;
              ziPontaj.PONTAT_REAL = getPontaje.rows[k].PONTAT_REAL;
              ziPontaj.PONTAT_CONFIRMAT = getPontaje.rows[k].PONTAT_CONFIRMAT;
              ziPontaj.ORA_I = getPontaje.rows[k].ORA_I;
              ziPontaj.ORA_E = getPontaje.rows[k].ORA_E;
              angajat.PONTAJE.push(ziPontaj);
              }
            }
          }
        }catch(e){
          (e);
        }
        

        randuri.push(angajat);
       
      }

      
      
      let getNumeFromDb = `select NUME, PRENUME from NUME_SALARIAT where ID_SALARIAT = (select ID_SALARIAT from UTILIZATORI where ID_UTILIZATOR = ${dep.userCurent}) `;
      const result2 = await database.simpleExecute(getNumeFromDb, {});
      let numeCurent = "";
      if (result2 && result2.rows && result2.rows[0]) {
        numeCurent = result2.rows[0].NUME + " " + result2.rows[0].PRENUME;
      }

      let numeSef = "";
    
      return {randuri,
              numeCurent: numeCurent,
              numeSef:numeSef       
      };
  
    } else {
      return null;
    }
  } else {
    return null;
  }
}


async function genereazaPdfLocatie(dep) {
  
  let query = querryLocatie;
  
 const binds = {};
if (dep.id_loc) {
  binds.id_loc = dep.id_loc;
  
  if(dep.date){
    const result = await database.simpleExecute(query, binds);
    if(result.rows === [] || result.rows === null){
      return null;
    }

    const randuri = [];
    for(let i=0;i<result.rows.length;i++) {
      let angajat = {};
      
      angajat.ID_SALARIAT = result.rows[i].ID_SALARIAT;
      angajat.NUME = result.rows[i].NUME;
      angajat.PRENUME = result.rows[i].PRENUME;
      angajat.MARCA = result.rows[i].MARCA;
      angajat.NUME_LUNG = result.rows[i].NUME_LUNG;
      angajat.PONTAJE = [];
      
      const binds2 = {};
      
      binds2.id_sal = angajat.ID_SALARIAT;
      binds2.limita1 = dep.limita1;
      binds2.limita2 = dep.limita2;
      try{
        const getPontaje =  await database.simpleExecute(`select ID_PONTAJ, to_char(DATA_PONTAJ + 1/12, 'dd/mm/yyyy') as DATA_PONTAJ, PONTAT_REAL, PONTAT_CONFIRMAT, ORA_I, ORA_E
        from PONTAJ where DATA_PONTAJ >= to_date(:limita1,'DD/MM/YYYY') and DATA_PONTAJ <= to_date(:limita2,'DD/MM/YYYY')	and ID_SALARIAT = :id_sal`, binds2);                                
        if(getPontaje.rows !== null && getPontaje.rows !== []) {
          
          // ("hellau " + angajat.ID_SALARIAT);
          // (getPontaje.rows);
          for(let k=0;k<getPontaje.rows.length;k++) {
            let ziPontaj = {};
            if(getPontaje.rows[k] !== null) {

            ziPontaj.DATA_PONTAJ = getPontaje.rows[k].DATA_PONTAJ;
            ziPontaj.ID_PONTAJ = getPontaje.rows[k].ID_PONTAJ;
            ziPontaj.PONTAT_REAL = getPontaje.rows[k].PONTAT_REAL;
            ziPontaj.PONTAT_CONFIRMAT = getPontaje.rows[k].PONTAT_CONFIRMAT;
            ziPontaj.ORA_I = getPontaje.rows[k].ORA_I;
            ziPontaj.ORA_E = getPontaje.rows[k].ORA_E;
            angajat.PONTAJE.push(ziPontaj);
            }
          }
        }
      }catch(e){
        (e);
      }
      

      randuri.push(angajat);
     
    }

    
    
    let getNumeFromDb = `select NUME, PRENUME from NUME_SALARIAT where ID_SALARIAT = (select ID_SALARIAT from UTILIZATORI where ID_UTILIZATOR = ${dep.userCurent}) `;
    const result2 = await database.simpleExecute(getNumeFromDb, {});
    let numeCurent = "";
    if (result2 && result2.rows && result2.rows[0]) {
      numeCurent = result2.rows[0].NUME + " " + result2.rows[0].PRENUME;
    }

    let numeSef = "";
  
    return {randuri,
            numeCurent: numeCurent,
            numeSef:numeSef       
    };

  } else {
    return null;
  }
} else {
  return null;
}
}


async function genereazaPdfLocatieDepart(dep) {
  
  let query = querryLocatieDepart;
  
 const binds = {};
if (dep.id_dep && dep.id_loc) {
  binds.id_dep = dep.id_dep;
  binds.id_loc = dep.id_loc;
  
  if(dep.date){
    const result = await database.simpleExecute(query, binds);
    (result);
    if(result.rows === [] || result.rows === null){
      return null;
    }

    const randuri = [];
    for(let i=0;i<result.rows.length;i++) {
      let angajat = {};
      
      angajat.ID_SALARIAT = result.rows[i].ID_SALARIAT;
      angajat.NUME = result.rows[i].NUME;
      angajat.PRENUME = result.rows[i].PRENUME;
      angajat.MARCA = result.rows[i].MARCA;
      angajat.NUME_LUNG = result.rows[i].NUME_LUNG;
      angajat.PONTAJE = [];
      
      const binds2 = {};
      
      binds2.id_sal = angajat.ID_SALARIAT;
      binds2.limita1 = dep.limita1;
      binds2.limita2 = dep.limita2;
      try{
        
        const getPontaje =  await database.simpleExecute(`select ID_PONTAJ, to_char(DATA_PONTAJ + 1/12, 'dd/mm/yyyy') as DATA_PONTAJ, PONTAT_REAL, PONTAT_CONFIRMAT, ORA_I, ORA_E
        from PONTAJ where DATA_PONTAJ >= to_date(:limita1,'DD/MM/YYYY') and DATA_PONTAJ <= to_date(:limita2,'DD/MM/YYYY')	and ID_SALARIAT = :id_sal`, binds2);                                
        (getPontaje);
        if(getPontaje.rows !== null && getPontaje.rows !== []) {
          
          // ("hellau " + angajat.ID_SALARIAT);
          // (getPontaje.rows);
          for(let k=0;k<getPontaje.rows.length;k++) {
            let ziPontaj = {};
            if(getPontaje.rows[k] !== null) {

            ziPontaj.DATA_PONTAJ = getPontaje.rows[k].DATA_PONTAJ;
            ziPontaj.ID_PONTAJ = getPontaje.rows[k].ID_PONTAJ;
            ziPontaj.PONTAT_REAL = getPontaje.rows[k].PONTAT_REAL;
            ziPontaj.PONTAT_CONFIRMAT = getPontaje.rows[k].PONTAT_CONFIRMAT;
            ziPontaj.ORA_I = getPontaje.rows[k].ORA_I;
            ziPontaj.ORA_E = getPontaje.rows[k].ORA_E;
            angajat.PONTAJE.push(ziPontaj);
            }
          }
        }
      }catch(e){
        (e);
      }
      

      randuri.push(angajat);
     
    }

    
    let getNumeFromDb = `select NUME, PRENUME from NUME_SALARIAT where ID_SALARIAT = (select ID_SALARIAT from UTILIZATORI where ID_UTILIZATOR = ${dep.userCurent}) `;
    const result2 = await database.simpleExecute(getNumeFromDb, {});
    let numeCurent = "";
    if (result2 && result2.rows && result2.rows[0]) {
      numeCurent = result2.rows[0].NUME + " " + result2.rows[0].PRENUME;
    }

    let numeSef = "";
  
    return {randuri,
            numeCurent: numeCurent,
            numeSef:numeSef       
    };

  } else {
    return null;
  }
} else {
  return null;
}
}


module.exports = {
    genereazaPdf: genereazaPdf,
    genereazaPdfLocatie: genereazaPdfLocatie,
    genereazaPdfLocatieDepart: genereazaPdfLocatieDepart
  };
  
