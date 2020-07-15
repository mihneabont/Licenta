const database = require("../services/database.js");

const zileSpeciale = ["NEM", "AM", "SIND", "CM", "CO", "COR", "SUSP", "DET", "IFP", "PRB", "REC"];

const getPontaje = `select * from pontaj
        where id_salariat in (select id_salariat from depart_salariat where ID_N_DEPART = :id_depart and TO_CHAR(DATA_PONTAJ, 'MM/YYYY') in :luna_an)`;

const getPontajeLocatie = `select * from pontaj
        where id_salariat in (select id_salariat from depart_salariat where ID_N_LOCATIE = :id_depart and TO_CHAR(DATA_PONTAJ, 'MM/YYYY') in :luna_an)`;

const getPontajeLocatieSiDep = `select * from pontaj
        where id_salariat in (select id_salariat from depart_salariat where ID_N_LOCATIE = :id_locatie and ID_N_DEPART = :id_depart and TO_CHAR(DATA_PONTAJ, 'MM/YYYY') in :luna_an)`;

async function confirmaPontaje(depart) {
    let query = getPontaje;
  
    const binds = {};
    if (depart.id) {
        binds.id_depart = depart.id;
        if(depart.date){
            binds.luna_an = depart.date;
            (binds);
            const result = await database.simpleExecute(query, binds);
            
            if(result.rows === null || result.rows === [] || result.rows.length === 0 || !result.rows) {
                return null;
            } 
            
            let nrRanduri = 0;
            for(let i=0;i< result.rows.length; i++) {
                var updateQuery = ``;
               if(result.rows[i].PONTAT_REAL && (result.rows[i].PONTAT_REAL.search(":") >= 0 ||  result.rows[i].PONTAT_REAL === "10+")){
                    updateQuery = `update pontaj set PONTAT_CONFIRMAT = '${result.rows[i].PONTAT_REAL}' where ID_PONTAJ = ${result.rows[i].ID_PONTAJ}`;
               } else {
                   if(zileSpeciale.includes(result.rows[i].ORA_I)) {
                        updateQuery = `update pontaj set PONTAT_CONFIRMAT ='${result.rows[i].ORA_I}' where ID_PONTAJ = ${result.rows[i].ID_PONTAJ}`;
                   }
               }
               if(updateQuery !== ``) {
                const update = await database.simpleExecute(updateQuery, {});
                
                if(update.rowsAffected === 1) {
                    nrRanduri++;
                }
               }
            }
            
            return nrRanduri;
        } else {
            return null;
        }
    } else {
        return null;
    }
} 


async function confirmaPontajeLocatie(depart) {
    let query = getPontajeLocatie;
  
    const binds = {};
    if (depart.id) {
        binds.id_depart = depart.id;
        if(depart.date){
            binds.luna_an = depart.date;
            (binds);
            const result = await database.simpleExecute(query, binds);
            
            if(result.rows === null || result.rows === [] || result.rows.length === 0 || !result.rows) {
                return null;
            } 
            
            let nrRanduri = 0;
            for(let i=0;i< result.rows.length; i++) {
                var updateQuery = ``;
               if(result.rows[i].PONTAT_REAL && (result.rows[i].PONTAT_REAL.search(":") >= 0 ||  result.rows[i].PONTAT_REAL === "10+")){
                    updateQuery = `update pontaj set PONTAT_CONFIRMAT = '${result.rows[i].PONTAT_REAL}' where ID_PONTAJ = ${result.rows[i].ID_PONTAJ}`;
               } else {
                   if(zileSpeciale.includes(result.rows[i].ORA_I)) {
                        updateQuery = `update pontaj set PONTAT_CONFIRMAT ='${result.rows[i].ORA_I}' where ID_PONTAJ = ${result.rows[i].ID_PONTAJ}`;
                   }
               }
               if(updateQuery !== ``) {
                const update = await database.simpleExecute(updateQuery, {});
                
                if(update.rowsAffected === 1) {
                    nrRanduri++;
                }
               }
            }
            
            return nrRanduri;
        } else {
            return null;
        }
    } else {
        return null;
    }
} 


async function confirmarePontajeDinDepSiLocatie(depart) {
    let query = getPontajeLocatieSiDep;
  
    const binds = {};
    (depart);
    if (depart.id_depart && depart.id_locatie) {
        binds.id_depart = depart.id_depart;
        binds.id_locatie = depart.id_locatie;
        if(depart.date){
            binds.luna_an = depart.date;
            const result = await database.simpleExecute(query, binds);
            (result);
            
            if(result.rows === null || result.rows === [] || result.rows.length === 0 || !result.rows) {
                return null;
            } 
            
            let nrRanduri = 0;
            for(let i=0;i< result.rows.length; i++) {
                var updateQuery = ``;
               if(result.rows[i].PONTAT_REAL && (result.rows[i].PONTAT_REAL.search(":") >= 0 ||  result.rows[i].PONTAT_REAL === "10+")){
                    updateQuery = `update pontaj set PONTAT_CONFIRMAT = '${result.rows[i].PONTAT_REAL}' where ID_PONTAJ = ${result.rows[i].ID_PONTAJ}`;
               } else {
                   if(zileSpeciale.includes(result.rows[i].ORA_I)) {
                        updateQuery = `update pontaj set PONTAT_CONFIRMAT ='${result.rows[i].ORA_I}' where ID_PONTAJ = ${result.rows[i].ID_PONTAJ}`;
                   }
               }
               if(updateQuery !== ``) {
                const update = await database.simpleExecute(updateQuery, {});
                
                if(update.rowsAffected === 1) {
                    nrRanduri++;
                }
               }
            }
            
            return nrRanduri;
        } else {
            return null;
        }
    } else {
        return null;
    }
} 

module.exports = {
    confirmaPontaje: confirmaPontaje,
    confirmaPontajeLocatie: confirmaPontajeLocatie,
    confirmarePontajeDinDepSiLocatie: confirmarePontajeDinDepSiLocatie
  };