const database = require("../services/database.js");
const oracledb = require("oracledb");

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC"
];

async function sendAndProcessFile(array) {
  let indexGasit = 0;
  let error = `Error at row(s): `;
  let contor = 0;
  let conn = null;
  try {
    try {
      conn = await oracledb.getConnection();
    } catch (err) {
      (err);
    }

    const test = await database.simpleExecuteWithConn(
      conn,
      `
    select NR_CEAS, COD_CARTELA, TO_CHAR(DATA_PONTAT + 1/12, 'dd/mm/yyyy') AS DATA_PONTAT, ORA_PONTAT, ACTIUNE
    from PONTAJ_CEAS where ID_PONTAJ_CEAS = (select max(ID_PONTAJ_CEAS) from PONTAJ_CEAS)`
    );

    array = array.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          t =>
            t.COD_CARTELA === item.COD_CARTELA &&
            t.TIP_PONTARE === item.TIP_PONTARE &&
            t.DATA_PONTARE === item.DATA_PONTARE
        )
    );

    if (test.rows.length > 0) {
      for (j in array) {
        if (
          array[j].ID_CEAS == test.rows[0].NR_CEAS &&
          array[j].COD_CARTELA == test.rows[0].COD_CARTELA &&
          array[j].ORA_PONTARE == test.rows[0].ORA_PONTAT &&
          array[j].TIP_PONTARE == test.rows[0].ACTIUNE &&
          array[j].DATA_PONTARE == test.rows[0].DATA_PONTAT
        ) {
          indexGasit = parseInt(j) + 1;
          break;
        }
      }
    }

    // let dif = array.length - indexGasit;
    // let stacks = parseInt(dif/10000)+1;
    // (dif + " " + array.length + " " + stacks);
    // for(let j=0;j<stacks;j++){
    //     let limit = indexGasit + 10000;
    //     if((parseInt(j)+1) == stacks){
    //         limit = array.length;
    //     }
    //     for (i = indexGasit; i < limit; i++) {
    for (let i = indexGasit; i < array.length; i++) {
      var pontare = {};
      let current_datetime = array[i].DATA_PONTARE.toString().split("/");

      pontare.ID_CEAS = array[i].ID_CEAS;
      pontare.COD_CARTELA = array[i].COD_CARTELA;
      pontare.DATA_PONTARE =
        current_datetime[0] +
        "/" +
        months[current_datetime[1] - 1] +
        "/" +
        current_datetime[2];
      pontare.ORA_PONTARE = array[i].ORA_PONTARE;
      pontare.TIP_PONTARE = array[i].TIP_PONTARE;

      let query2 = ``;
      if (pontare.TIP_PONTARE == "IN") {
        query2 = `INSERT INTO PONTAJ_CEAS
                VALUES(NVL((select max(ID_PONTAJ_CEAS)+1 from PONTAJ_CEAS),1),
                '${pontare.ID_CEAS}', '${pontare.COD_CARTELA}', '${pontare.DATA_PONTARE}', '${pontare.ORA_PONTARE}', '${pontare.TIP_PONTARE}')`;

        try {
          const insertCeas = await database.simpleExecuteWithConn(conn, query2);
          if (insertCeas.rowsAffected == 1) {
            //(`Valori adaugate in tabela PONTAJ_CEAS de la indexul: ${i}`);
          }
        } catch (e) {
          error += `EROARE la index ${i}: ` + e + `\n`;
        }
        const test = await database.simpleExecuteWithConn(
          conn,
          `SELECT ID_PONTAJ, ORA_I, ORA_E FROM PONTAJ
                                WHERE ID_SALARIAT = (select ID_SALARIAT from N_CARTELE where COD_CARTELA = '${pontare.COD_CARTELA}' and DATA_IES IS NULL AND DATA_INCEP IS NOT NULL)
                                and DATA_PONTAJ = '${pontare.DATA_PONTARE}'`
        );
        if (test.rows.length === 1) {
          (test.rows);
          let queryUpdatePontaj;
          let minuteReale = 0;
          let oreReale = "";
          if (test.rows[0].ORA_E !== null) {
            let inArray = pontare.ORA_PONTARE.toString().split(":");
            let outArray = test.rows[0].ORA_E.toString().split(":");
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
            queryUpdatePontaj = `UPDATE PONTAJ SET
                                            ORA_I = '${pontare.ORA_PONTARE}',
                                            PONTAT_REAL = '${oreReale}'
                                            WHERE ID_PONTAJ = ${test.rows[0].ID_PONTAJ}`;
          } else {
            queryUpdatePontaj = `UPDATE PONTAJ SET
                                            ORA_I = '${pontare.ORA_PONTARE}'
                                            WHERE ID_PONTAJ = ${test.rows[0].ID_PONTAJ}`;
          }

          try {
            const testPontaj = await database.simpleExecuteWithConn(
              conn,
              queryUpdatePontaj
            );
            if (testPontaj.rowsAffected == 1) {
              //(`Update in tabela PONTAJ de la indexul: ${i}`);
            }
          } catch (e) {
            error += `EROARE la index ${i}: ` + e + `\n`;
          }
        } else if (test.rows.length == 0) {
          let queryAddPontaj = `INSERT INTO PONTAJ
                     VALUES(NVL((select max(ID_PONTAJ) +1 from PONTAJ),1), (select ID_SALARIAT from N_CARTELE where COD_CARTELA = '${pontare.COD_CARTELA}' and DATA_IES IS NULL AND DATA_INCEP IS NOT NULL), '${pontare.DATA_PONTARE}',null ,null , '${pontare.ORA_PONTARE}', null)`;

          try {
            const testPontaj = await database.simpleExecuteWithConn(
              conn,
              queryAddPontaj
            );
            if (testPontaj.rowsAffected == 1) {
              //(`Valori adaugate in tabela PONTAJ de la indexul: ${i}`);
            }
          } catch (e) {
            error += `EROARE la index ${i}: ` + e + `\n`;
          }
        }
      } else if (pontare.TIP_PONTARE == "OT") {
        query2 = `INSERT INTO PONTAJ_CEAS
                            VALUES(NVL((select max(ID_PONTAJ_CEAS)+1 from PONTAJ_CEAS),1),
                            '${pontare.ID_CEAS}', '${pontare.COD_CARTELA}', '${pontare.DATA_PONTARE}', '${pontare.ORA_PONTARE}', '${pontare.TIP_PONTARE}') `;
        // query2 = `INSERT INTO PONTAJ_CEAS(NR_CEAS, COD_CARTELA, DATA_PONTAT, ORA_PONTAT, ACTIUNE, DATA_ORA_OPER, ID_N_CALCO)
        // VALUES(
        // '${pontare.ID_CEAS}', '${pontare.COD_CARTELA}', '${pontare.DATA_PONTARE}', '${pontare.ORA_PONTARE}', '${pontare.TIP_PONTARE}', sysdate, 5) `;

        try {
          const insertCeas = await database.simpleExecuteWithConn(conn, query2);
          if (insertCeas.rowsAffected == 1) {
            //(`Valori adaugate in tabela PONTAJ_CEAS de la indexul: ${i}`);
          }
        } catch (e) {
          error += `EROARE la index ${i}: ` + e + `\n`;
        }

        const test = await database.simpleExecuteWithConn(
          conn,
          `SELECT ID_PONTAJ, ORA_I FROM PONTAJ
                                WHERE ID_SALARIAT = (select ID_SALARIAT from N_CARTELE where COD_CARTELA = '${pontare.COD_CARTELA}' and DATA_IES IS NULL AND DATA_INCEP IS NOT NULL)
                                and DATA_PONTAJ = '${pontare.DATA_PONTARE}'`
        );
        if (test.rows.length == 1) {
          let queryUpdatePontaj;
          let minuteReale = 0;
          let oreReale = "";
          if (test.rows[0].ORA_I !== null) {
            let outArray = pontare.ORA_PONTARE.toString().split(":");
            let inArray = test.rows[0].ORA_I.toString().split(":");
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
            queryUpdatePontaj = `UPDATE PONTAJ SET
                                            ORA_E = '${pontare.ORA_PONTARE}',
                                            PONTAT_REAL = '${oreReale}'
                                            WHERE ID_PONTAJ = ${test.rows[0].ID_PONTAJ}`;
          } else {
            queryUpdatePontaj = `UPDATE PONTAJ SET
                                            ORA_E = '${pontare.ORA_PONTARE}'
                                            WHERE ID_PONTAJ = ${test.rows[0].ID_PONTAJ}`;
          }

          try {
            const testPontaj = await database.simpleExecuteWithConn(
              conn,
              queryUpdatePontaj
            );
            if (testPontaj.rowsAffected == 1) {
              //(`Update in tabela PONTAJ de la indexul: ${i}`);
            }
          } catch (e) {
            error += `EROARE la index ${i}: ` + e + `\n`;
          }
        } else if (test.rows.length == 0) {
          let queryAddPontaj = `INSERT INTO PONTAJ
                     VALUES(NVL((select max(ID_PONTAJ) +1 from PONTAJ),1), (select ID_SALARIAT from N_CARTELE where COD_CARTELA = '${pontare.COD_CARTELA}' and DATA_IES IS NULL AND DATA_INCEP IS NOT NULL), '${pontare.DATA_PONTARE}',null ,null , null, '${pontare.ORA_PONTARE}')`;
          //  let queryAddPontaj = `INSERT INTO PONTAJ(ID_SALARIAT, DATA_PONTAJ, PONTAT_REAL, PONTAT_CONFIRMAT, ORA_I, ORA_E, DATA_ORA_OPER, ID_N_CALCO)
          //  VALUES( (select ID_SALARIAT from N_CARTELE where COD_CARTELA = '${pontare.COD_CARTELA}'), '${pontare.DATA_PONTARE}',null ,null , null, '${pontare.ORA_PONTARE}', sysdate, 5)`;

          try {
            const testPontaj = await database.simpleExecuteWithConn(
              conn,
              queryAddPontaj
            );
            if (testPontaj.rowsAffected == 1) {
              //(`Valori adaugate in tabela PONTAJ de la indexul: ${i}`);
            }
          } catch (e) {
            error += `EROARE la index ${i}: ` + e + `\n`;
          }
        }
      }
      contor++;
      //await sleep(10);
      //("contor:"+contor);
    }

    //         indexGasit = i;
    //     }
    // }
    ("contor:" + contor);
    if (contor == 0) {
      return "Fisierul este identic.";
    } else {
      return contor + " valori inserate in PONTAJ_CEAS. " + error;
    }
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        (err);
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  sendAndProcessFile: sendAndProcessFile
};
