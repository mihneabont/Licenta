const moment =  require("moment");

const database = require("../services/database.js");
const CODURI_CONCEDIU = [
    "AM",
    "SIND",
    "CM",
    "CO",
    "COR",
    "SUSP",
    "T",
    "DFD",
    "DET",
    "DEL",
    "IFP",
    "PRB",
    "REC",
    "CCM",
    "CC12",
  ];

const gasesteAngajatCartela = `SELECT ID_SALARIAT FROM N_CARTELE WHERE COD_CARTELA = :codCartela`;

const selectAparatMAC = `SELECT * FROM APARATE WHERE ADRESA_MAC = :adresaMAC`;

const getPontaj = `SELECT * from PONTAJ where to_char(DATA_PONTAJ + 1/12, 'dd/mm/yyyy') = :dataPontaj and ID_SALARIAT = :idSalariat`;

const insertOraI = `INSERT INTO PONTAJ(ID_PONTAJ, ID_SALARIAT, DATA_PONTAJ, PONTAT_REAL, PONTAT_CONFIRMAT, ORA_I,ORA_E) VALUES(NVL((select max(ID_PONTAJ) +1 from PONTAJ),1), :idSalariat, sysdate, '0:00',null, :oraI, null)`;

const updateConcediu = `UPDATE PONTAJ SET ORA_I = :oraI WHERE ID_PONTAJ = :idPontaj`;

const insertOraE = `UPDATE PONTAJ SET ORA_E = :oraE, PONTAT_REAL = :pontatReal WHERE  ID_PONTAJ = :idPontaj`;

const insertAparat =
  "INSERT INTO APARATE(ID_APARAT, ADRESA_MAC, ULTIMA_PORNIRE) VALUES (NVL((select max(ID_APARAT) +1 from APARATE),1), :adresaMAC, sysdate )";

const updateAparat =
  "UPDATE APARATE SET ULTIMA_PORNIRE = sysdate WHERE ADRESA_MAC = :adresaMAC";

async function getAngajatCuCod(codCartela) {
  let query = gasesteAngajatCartela;
  const binds = { codCartela: codCartela };
  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

async function insertOraScanata(idSalariat) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  var ora = new moment();
  ora = ora.format("HH:mm");
  let query = getPontaj;
  let binds = { dataPontaj: today, idSalariat: idSalariat };
  let result = await database.simpleExecute(query, binds);
  let resultInsert;
  if (!result.rows.length) {
    query = insertOraI;
    binds = { idSalariat: idSalariat, oraI: ora };
    resultInsert = await database.simpleExecute(query, binds);
  } else {
      if(CODURI_CONCEDIU.includes(result.rows[0].ORA_I)) {
        query = updateConcediu;
        binds = {oraI: ora, idPontaj:result.rows[0].ID_PONTAJ}
        resultInsert = await database.simpleExecute(query, binds);
      } else {
        let inArray = result.rows[0].ORA_I.toString().split(":");
        let outArray = ora.toString().split(":");
        let minuteReale;
        let oreReale;
        minuteReale =
          parseInt(outArray[0] * 60) +
          parseInt(outArray[1]) -
          parseInt(inArray[0] * 60) -
          parseInt(inArray[1]);
        if (parseInt(minuteReale / 60) >= 10) {
          oreReale = "10+";
        } else {
          oreReale =
            parseInt(minuteReale / 60) +
            ":" +
            (parseInt(minuteReale % 60) >= 10
              ? parseInt(minuteReale % 60)
              : "0" + parseInt(minuteReale % 60));
        }
        if(oreReale !== "0:00"){
            query = insertOraE;
            binds = {oraE: ora, pontatReal: oreReale, idPontaj:result.rows[0].ID_PONTAJ}
            resultInsert = await database.simpleExecute(query, binds);
        }
      }
  }
  console.log(resultInsert);
  return resultInsert;
}

async function registerAparat(adresaMAC) {
  let query = selectAparatMAC;
  const binds = { adresaMAC: adresaMAC };
  const result = await database.simpleExecute(query, binds);
  var queryResult = null;
  if (result.rows.length === 0) {
    queryResult = await database.simpleExecute(insertAparat, binds);
  } else {
    queryResult = await database.simpleExecute(updateAparat, binds);
  }
  return queryResult;
}

module.exports = {
  getAngajatCuCod: getAngajatCuCod,
  registerAparat: registerAparat,
  insertOraScanata: insertOraScanata,
};
