const downloadPdf = require("../db_apis/downloadPdf.js");
const config = require("../config/token.js");
var jwt = require("jsonwebtoken");
const puppetter = require("puppeteer");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");

const pdf = require("html-pdf");
const pdfTemplate = require("../documents");
var primulAngajat = true;

const compile = async function(templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  console.log(filePath);
  const html = await fs.readFile(filePath, "utf-8");
  return hbs.compile(html)(data);
};

async function get(req, res, next) {
  try {
    //   var token;
    //   var payload;

    //     if (!req.headers.authorization) {
    //         return res.status(401).send({message: 'You are not authorized'});
    //     }

    //     token = req.headers.authorization;

    //     try {
    //         payload = jwt.verify(token, config.jwtSecretKey_admin);
    //     } catch (e) {
    //         if (e.name === 'TokenExpiredError') {
    //             res.status(401).send({message: 'Token Expired'});
    //         } else if(e.name === "JsonWebTokenError"){
    //         res.status(401).send({message: 'Not Admin'});
    //         } else {
    //             res.status(401).send({message: 'Authentication failed'});
    //         }
    //         return;
    //     }

    let reqPath = path.join(__dirname, "../../");

    res.sendFile(`${reqPath}/pontaj.pdf`);
  } catch (err) {
    next(err);
  }
}

async function get2(req, res, next) {
  try {
    //   var token;
    //   var payload;

    //     if (!req.headers.authorization) {
    //         return res.status(401).send({message: 'You are not authorized'});
    //     }

    //     token = req.headers.authorization;

    //     try {
    //         payload = jwt.verify(token, config.jwtSecretKey_admin);
    //     } catch (e) {
    //         if (e.name === 'TokenExpiredError') {
    //             res.status(401).send({message: 'Token Expired'});
    //         } else if(e.name === "JsonWebTokenError"){
    //         res.status(401).send({message: 'Not Admin'});
    //         } else {
    //             res.status(401).send({message: 'Authentication failed'});
    //         }
    //         return;
    //     }

    let reqPath = path.join(__dirname, "../../");

    res.sendFile(`${reqPath}/ghid.pdf`);
  } catch (err) {
    next(err);
  }
}

async function post(req, res, next) {
  try {
    var token;
    var payload;

    if (!req.headers.authorization) {
      return res.status(401).send({ message: "You are not authorized" });
    }

    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
      try {
        payload = jwt.verify(token, config.jwtSecretKey_admin);
      } catch (e) {
        if (e.name === "TokenExpiredError") {
          res.status(401).send({ message: "Token Expired" });
        } else {
          res.status(401).send({ message: "Authentication failed" });
        }
        return;
      }
    }

    const context = {};

    context.id = parseInt(req.body.id, 10);
    if (req.body.date) {
      context.date = req.body.date.replace("-", "/");
    }

    if (req.body.jumatate) {
      context.jumatate = req.body.jumatate;
    }

    if (req.body.userCurent) {
      context.userCurent = req.body.userCurent;
    }

    try {
      let lunaArray = context.date.split("/");
      let ultima_zi = new Date(
        Date.UTC(lunaArray[1], lunaArray[0], 0)
      ).getDate();

      var datetime = new Date();
      var data_azi = datetime
        .toISOString()
        .slice(0, 10)
        .split("-");
      var ora_azi = datetime.toString().split(" ")[4];

      let data_tiparit = data_azi[2] + "." + data_azi[1] + "." + data_azi[0];

      if (context.jumatate === "1") {
        context.limita1 = "01/" + context.date;
        context.limita2 = "15/" + context.date;
      } else if (context.jumatate === "2") {
        context.limita1 = "01/" + context.date;
        context.limita2 = "" + ultima_zi + "/" + context.date;
      }

      const rowsBD = await downloadPdf.genereazaPdf(context);
      if (rowsBD === null || rowsBD.length === 0) {
        res.status(404).end();
        return;
      }

      var numeCurent = rowsBD.numeCurent;
      var sefDepartament = rowsBD.numeSef;
      const rows = rowsBD.randuri;
      // console.log("aaa");
      //   console.log(rows[1]);
      var departament = "";
      if (rows && rows[0]) {
        departament = rows[0].NUME_LUNG.toUpperCase();
      }

      var lunaInString;
      switch (context.date.split("/")[0]) {
        case "01":
          lunaInString = "Ianuarie";
          break;
        case "02":
          lunaInString = "Februarie";
          break;
        case "03":
          lunaInString = "Martie";
          break;
        case "04":
          lunaInString = "Aprilie";
          break;
        case "05":
          lunaInString = "Mai";
          break;
        case "06":
          lunaInString = "Iunie";
          break;
        case "07":
          lunaInString = "Iulie";
          break;
        case "08":
          lunaInString = "August";
          break;
        case "09" || "9":
          lunaInString = "Septembrie";
          break;
        case "10":
          lunaInString = "Octombrie";
          break;
        case "11":
          lunaInString = "Noiembrie";
          break;
        case "12":
          lunaInString = "Decembrie";
          break;
      }

      data = {
        departament: departament,
        perioada:
          context.limita1.split("/")[0] +
          " ... " +
          context.limita2.split("/")[0] +
          " " +
          lunaInString +
          " " +
          context.date.split("/")[1],
        dataTiparirii: data_tiparit,
        oraTiparirii: ora_azi,
        intocmit: numeCurent || "",
        sefDepartament: sefDepartament || "",
        pagini: {}
      };

      let contor = 0;
      let nrPag = 0;

      for (let i = 0; i < rows.length; i++) {
        if (contor == 0) {
          data.pagini[nrPag] = [];
          data.pagini[nrPag].randuri = [];
        }

        let angajat = {};
        angajat.nrCrt = i + 1;
        angajat.nume = rows[i].NUME;
        angajat.prenume = rows[i].PRENUME;
        angajat.marca = rows[i].MARCA;
        let zile = getZile(context.date, context.jumatate);
        angajat.zile = zile.zile;

        let genereazaOre = getOre(ultima_zi, rows[i].PONTAJE);
        for (const property in genereazaOre) {
          angajat[property] = genereazaOre[property];
        }

         console.log(angajat);

        var oRegie = "00:00";
        var oNorma = "00:00";
        for (let j = 0; j < angajat.orePontat.length; j++) {
          // console.log(angajat.zile[i].prescurtare + " " + comparaOre(angajat.orePontat[j].oraR));
          if (
            angajat.zile[j].prescurtare === "V" &&
            comparaOreVineri(angajat.orePontat[j].oraC) == true
          ) {
            angajat.orePontat[j].oraC = "6:00";
          } else if (
            (angajat.zile[j].prescurtare === "L" ||
              angajat.zile[j].prescurtare === "Ma" ||
              angajat.zile[j].prescurtare === "Mi" ||
              angajat.zile[j].prescurtare === "J") &&
            comparaOreSapt(angajat.orePontat[j].oraC) == true
          ) {
            angajat.orePontat[j].oraC = "8:30";
          }
          oRegie = addTimes(oRegie, angajat.orePontat[j].oraC);
        }

        for (let j = 0; j < angajat.orePontat.length; j++) {
          // console.log(angajat.zile[i].prescurtare + " " + comparaOre(angajat.orePontat[j].oraR));
          console.log(angajat.orePontat[j]);
          if (
            angajat.zile[j].prescurtare === "V" && (angajat.orePontat[j].oraR || angajat.orePontat[j].oraC)
          ) {
            oNorma = addTimes(oNorma, "6:00");
          } else if (
            (angajat.zile[j].prescurtare === "L" ||
              angajat.zile[j].prescurtare === "Ma" ||
              angajat.zile[j].prescurtare === "Mi" ||
              angajat.zile[j].prescurtare === "J") && (angajat.orePontat[j].oraR || angajat.orePontat[j].oraC)
          ) {
            oNorma = addTimes(oNorma, "8:30");
          }
        }
        angajat.oNorma = oNorma;
        angajat.oRegie = oRegie;
        data.pagini[nrPag].randuri.push(angajat);

        contor++;
        if (contor == 4) {
          contor = 0;
          nrPag++;
        }
      }

      // console.log(data.pagini[0].randuri[1]);
      // console.log(data.pagini[1]);

      /*  data = {
          departament: "TEHNOLOGIA INFORMATIEI SI COMUNICATII GRIVITA",
          perioada: "1 ... 15 Ianuarie 2020",
          dataTiparirii: "16.01.2020",
          oraTiparirii: "08:32:32",
          intocmit: " STANCIU Magdalena",
          sefDepartament: "CRIT Adrian",
          pagini: {
            0: {
              randuri: [
                {
                  nume: "Balan",
                  prenume: "Eugeniu",
                  marca: "13933",
                  ticheteMasa: "21",
                  oNorma: "071:25",
                  oRegie: "071:30",
                  zCM: "0",
                  zCO: "0",
                  zFP: "0",
                  oSUPL: "0",
                  zSUSP: "0",
                  NEM: "0",
                  AM: "0",
                  SIND: "0",
                  CM: "0",
                  CO: "0",
                  COR: "0",
                  DEL: "0",
                  oIFP: "0",
                  SUSP: "0",
                  DFD: "0",
                  DET: "0",
                  PRB: "0",
                  REC: "0",
                  CCM: "0",
                  oPCeas: "025:53",
                  zDDiurna: "0",
                  zile: [
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "J", numar: "02" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" },
                    { prescurtare: "Mi", numar: "01" }
                  ],
                  ore: [
                    { oraI: "Mi", oraE: "01" },
                    { oraI: "Mi", oraE: "01" }
                  ]
                },
                { nume: "Eugen" }
              ]
            },
            1: { randuri: [{ nume: "Balan" }, { nume: "Eugen" }] }
          }
        };*/
      hbs.registerHelper("inc", function(value, options) {
        return parseInt(value) + x;
      });
      hbs.registerHelper("checkNull", function(value, options) {
        if (value === "null") return " ";
        return value;
      });
      const browser = await puppetter.launch();
      const page = await browser.newPage();
      const content = await compile("template", data);
      await page.setContent(content);
      await page.emulateMedia("screen");
      await page.pdf({
        path: "pontaj.pdf",
        format: "A4",
        landscape: true,
        printBackground: true
      });
      console.log("done");
      await browser.close();
      res.send(Promise.resolve());
    } catch (e) {
      console.log(e);
      res.send(Promise.reject());
    }
  } catch (err) {
    next(err);
  }
}

async function post2(req, res, next) {
  try {
    var token;
    var payload;

    if (!req.headers.authorization) {
      return res.status(401).send({ message: "You are not authorized" });
    }

    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
      try {
        payload = jwt.verify(token, config.jwtSecretKey_admin);
      } catch (e) {
        if (e.name === "TokenExpiredError") {
          res.status(401).send({ message: "Token Expired" });
        } else {
          res.status(401).send({ message: "Authentication failed" });
        }
        return;
      }
    }

    const context = {};

    context.id_loc = parseInt(req.body.id_loc, 10);
    var pdfDepartamentTitlu = "";
    if (req.body.titlu) {
      pdfDepartamentTitlu = req.body.titlu;
    }

    if (req.body.date) {
      context.date = req.body.date.replace("-", "/");
    }

    if (req.body.jumatate) {
      context.jumatate = req.body.jumatate;
    }

    if (req.body.userCurent) {
      context.userCurent = req.body.userCurent;
    }

    try {
      let lunaArray = context.date.split("/");
      let ultima_zi = new Date(
        Date.UTC(lunaArray[1], lunaArray[0], 0)
      ).getDate();

      var datetime = new Date();
      var data_azi = datetime
        .toISOString()
        .slice(0, 10)
        .split("-");
      var ora_azi = datetime.toString().split(" ")[4];

      let data_tiparit = data_azi[2] + "." + data_azi[1] + "." + data_azi[0];

      if (context.jumatate === "1") {
        context.limita1 = "01/" + context.date;
        context.limita2 = "15/" + context.date;
      } else if (context.jumatate === "2") {
        context.limita1 = "01/" + context.date;
        context.limita2 = "" + ultima_zi + "/" + context.date;
      }

      const rowsBD = await downloadPdf.genereazaPdfLocatie(context);
      if (rowsBD === null || rowsBD.length === 0) {
        res.status(404).end();
        return;
      }

      var numeCurent = rowsBD.numeCurent;
      var sefDepartament = rowsBD.numeSef;
      const rows = rowsBD.randuri;
      var departament = pdfDepartamentTitlu;

      var lunaInString;
      switch (context.date.split("/")[0]) {
        case "01":
          lunaInString = "Ianuarie";
          break;
        case "02":
          lunaInString = "Februarie";
          break;
        case "03":
          lunaInString = "Martie";
          break;
        case "04":
          lunaInString = "Aprilie";
          break;
        case "05":
          lunaInString = "Mai";
          break;
        case "06":
          lunaInString = "Iunie";
          break;
        case "07":
          lunaInString = "Iulie";
          break;
        case "08":
          lunaInString = "August";
          break;
        case "09" || "9":
          lunaInString = "Septembrie";
          break;
        case "10":
          lunaInString = "Octombrie";
          break;
        case "11":
          lunaInString = "Noiembrie";
          break;
        case "12":
          lunaInString = "Decembrie";
          break;
      }

      data = {
        departament: departament,
        perioada:
          context.limita1.split("/")[0] +
          " ... " +
          context.limita2.split("/")[0] +
          " " +
          lunaInString +
          " " +
          context.date.split("/")[1],
        dataTiparirii: data_tiparit,
        oraTiparirii: ora_azi,
        intocmit: numeCurent || "",
        sefDepartament: sefDepartament || "",
        pagini: {}
      };

      let contor = 0;
      let nrPag = 0;

      for (let i = 0; i < rows.length; i++) {
        if (contor == 0) {
          data.pagini[nrPag] = [];
          data.pagini[nrPag].randuri = [];
        }

        let angajat = {};
        angajat.nrCrt = i + 1;
        angajat.nume = rows[i].NUME;
        angajat.prenume = rows[i].PRENUME;
        angajat.marca = rows[i].MARCA;
        let zile = getZile(context.date, context.jumatate);
        angajat.oNorma = zile.oNorma;
        angajat.zile = zile.zile;

        let genereazaOre = getOre(ultima_zi, rows[i].PONTAJE);
        for (const property in genereazaOre) {
          angajat[property] = genereazaOre[property];
        }

        var oRegie = "00:00";
        var oNorma = "00:00";

        for (let j = 0; j < angajat.orePontat.length; j++) {
          if (
            angajat.zile[j].prescurtare === "V" &&
            comparaOreVineri(angajat.orePontat[j].oraC) == true
          ) {
            angajat.orePontat[j].oraC = "6:00";
          } else if (
            (angajat.zile[j].prescurtare === "L" ||
              angajat.zile[j].prescurtare === "Ma" ||
              angajat.zile[j].prescurtare === "Mi" ||
              angajat.zile[j].prescurtare === "J") &&
            comparaOreSapt(angajat.orePontat[j].oraC) == true
          ) {
            angajat.orePontat[j].oraC = "8:30";
          }
          oRegie = addTimes(oRegie, angajat.orePontat[j].oraC);
        }

        for (let j = 0; j < angajat.orePontat.length; j++) {
          // console.log(angajat.zile[i].prescurtare + " " + comparaOre(angajat.orePontat[j].oraR));
          if (
            angajat.zile[j].prescurtare === "V" && (angajat.orePontat[j].oraR || angajat.orePontat[j].oraC)
          ) {
            oNorma = addTimes(oNorma, "6:00");
          } else if (
            (angajat.zile[j].prescurtare === "L" ||
              angajat.zile[j].prescurtare === "Ma" ||
              angajat.zile[j].prescurtare === "Mi" ||
              angajat.zile[j].prescurtare === "J") && (angajat.orePontat[j].oraR || angajat.orePontat[j].oraC)
          ) {
            oNorma = addTimes(oNorma, "8:30");
          }
        }
        angajat.oNorma = oNorma;
        angajat.oRegie = oRegie;
        data.pagini[nrPag].randuri.push(angajat);

        contor++;
        if (contor == 4) {
          contor = 0;
          nrPag++;
        }
      }

      hbs.registerHelper("inc", function(value, options) {
        return parseInt(value) + x;
      });
      hbs.registerHelper("checkNull", function(value, options) {
        if (value === "null") return " ";
        return value;
      });
      const browser = await puppetter.launch();
      const page = await browser.newPage();
      const content = await compile("template", data);
      await page.setContent(content);
      await page.emulateMedia("screen");
      await page.pdf({
        path: "pontaj.pdf",
        format: "A4",
        landscape: true,
        printBackground: true
      });
      console.log("done");
      await browser.close();
      res.send(Promise.resolve());
    } catch (e) {
      console.log(e);
      res.send(Promise.reject());
    }
  } catch (err) {
    next(err);
  }
}

async function post3(req, res, next) {
  try {
    var token;
    var payload;

    if (!req.headers.authorization) {
      return res.status(401).send({ message: "You are not authorized" });
    }

    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
      try {
        payload = jwt.verify(token, config.jwtSecretKey_admin);
      } catch (e) {
        if (e.name === "TokenExpiredError") {
          res.status(401).send({ message: "Token Expired" });
        } else {
          res.status(401).send({ message: "Authentication failed" });
        }
        return;
      }
    }

    const context = {};

    context.id_dep = parseInt(req.body.id_dep, 10);
    context.id_loc = parseInt(req.body.id_loc, 10);

    var pdfDepartamentTitlu = "";
    if (req.body.titlu) {
      pdfDepartamentTitlu = req.body.titlu;
    }

    if (req.body.date) {
      context.date = req.body.date.replace("-", "/");
    }

    if (req.body.jumatate) {
      context.jumatate = req.body.jumatate;
    }

    if (req.body.userCurent) {
      context.userCurent = req.body.userCurent;
    }

    try {
      let lunaArray = context.date.split("/");
      let ultima_zi = new Date(
        Date.UTC(lunaArray[1], lunaArray[0], 0)
      ).getDate();

      var datetime = new Date();
      var data_azi = datetime
        .toISOString()
        .slice(0, 10)
        .split("-");
      var ora_azi = datetime.toString().split(" ")[4];

      let data_tiparit = data_azi[2] + "." + data_azi[1] + "." + data_azi[0];

      if (context.jumatate === "1") {
        context.limita1 = "01/" + context.date;
        context.limita2 = "15/" + context.date;
      } else if (context.jumatate === "2") {
        context.limita1 = "01/" + context.date;
        context.limita2 = "" + ultima_zi + "/" + context.date;
      }

      const rowsBD = await downloadPdf.genereazaPdfLocatieDepart(context);
      if (rowsBD === null || rowsBD.length === 0) {
        res.status(404).end();
        return;
      }

      var numeCurent = rowsBD.numeCurent;
      var sefDepartament = rowsBD.numeSef;
      const rows = rowsBD.randuri;
      var departament = pdfDepartamentTitlu;

      var lunaInString;
      switch (context.date.split("/")[0]) {
        case "01":
          lunaInString = "Ianuarie";
          break;
        case "02":
          lunaInString = "Februarie";
          break;
        case "03":
          lunaInString = "Martie";
          break;
        case "04":
          lunaInString = "Aprilie";
          break;
        case "05":
          lunaInString = "Mai";
          break;
        case "06":
          lunaInString = "Iunie";
          break;
        case "07":
          lunaInString = "Iulie";
          break;
        case "08":
          lunaInString = "August";
          break;
        case "09" || "9":
          lunaInString = "Septembrie";
          break;
        case "10":
          lunaInString = "Octombrie";
          break;
        case "11":
          lunaInString = "Noiembrie";
          break;
        case "12":
          lunaInString = "Decembrie";
          break;
      }

      data = {
        departament: departament,
        perioada:
          context.limita1.split("/")[0] +
          " ... " +
          context.limita2.split("/")[0] +
          " " +
          lunaInString +
          " " +
          context.date.split("/")[1],
        dataTiparirii: data_tiparit,
        oraTiparirii: ora_azi,
        intocmit: numeCurent || "",
        sefDepartament: sefDepartament || "",
        pagini: {}
      };

      let contor = 0;
      let nrPag = 0;

      for (let i = 0; i < rows.length; i++) {
        if (contor == 0) {
          data.pagini[nrPag] = [];
          data.pagini[nrPag].randuri = [];
        }

        let angajat = {};
        angajat.nrCrt = i + 1;
        angajat.nume = rows[i].NUME;
        angajat.prenume = rows[i].PRENUME;
        angajat.marca = rows[i].MARCA;
        let zile = getZile(context.date, context.jumatate);
        angajat.oNorma = zile.oNorma;
        angajat.zile = zile.zile;

        let genereazaOre = getOre(ultima_zi, rows[i].PONTAJE);
        for (const property in genereazaOre) {
          angajat[property] = genereazaOre[property];
        }

        var oRegie = "00:00";
        var oNorma = "00:00";
        for (let j = 0; j < angajat.orePontat.length; j++) {
          if (
            angajat.zile[j].prescurtare === "V" &&
            comparaOreVineri(angajat.orePontat[j].oraC) == true
          ) {
            angajat.orePontat[j].oraC = "6:00";
          } else if (
            (angajat.zile[j].prescurtare === "L" ||
              angajat.zile[j].prescurtare === "Ma" ||
              angajat.zile[j].prescurtare === "Mi" ||
              angajat.zile[j].prescurtare === "J") &&
            comparaOreSapt(angajat.orePontat[j].oraC) == true
          ) {
            angajat.orePontat[j].oraC = "8:30";
          }
          oRegie = addTimes(oRegie, angajat.orePontat[j].oraC);
        }
        for (let j = 0; j < angajat.orePontat.length; j++) {
          // console.log(angajat.zile[i].prescurtare + " " + comparaOre(angajat.orePontat[j].oraR));
          console.log(angajat);
          if (
            angajat.zile[j].prescurtare === "V" && (angajat.orePontat[j].oraR || angajat.orePontat[j].oraC)
          ) {
            oNorma = addTimes(oNorma, "6:00");
          } else if (
            (angajat.zile[j].prescurtare === "L" ||
              angajat.zile[j].prescurtare === "Ma" ||
              angajat.zile[j].prescurtare === "Mi" ||
              angajat.zile[j].prescurtare === "J") && (angajat.orePontat[j].oraR || angajat.orePontat[j].oraC)
          ) {
            oNorma = addTimes(oNorma, "8:30");
          }
        }
        angajat.oNorma = oNorma;
        primulAngajat = false;
        angajat.oRegie = oRegie;
        data.pagini[nrPag].randuri.push(angajat);
        contor++;
        if (contor == 4) {
          contor = 0;
          nrPag++;
        }
      }

      hbs.registerHelper("inc", function(value, options) {
        return parseInt(value) + x;
      });
      hbs.registerHelper("checkNull", function(value, options) {
        if (value === "null") return " ";
        return value;
      });
      const browser = await puppetter.launch();
      const page = await browser.newPage();
      const content = await compile("template", data);
      await page.setContent(content);
      await page.emulateMedia("screen");
      await page.pdf({
        path: "pontaj.pdf",
        format: "A4",
        landscape: true,
        printBackground: true
      });
      console.log("done");
      await browser.close();
      res.send(Promise.resolve());
    } catch (e) {
      console.log(e);
      res.send(Promise.reject());
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  get: get,
  get2: get2,
  post: post,
  post2: post2,
  post3: post3
};

function getZile(luna, jum) {
  let zile = [];
  var oNorma = "00:00";
  let lunaArray = luna.split("/");
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  let ultima_zi = new Date(Date.UTC(lunaArray[1], lunaArray[0], 0)).getDate();

  for (let i = 1; i <= ultima_zi; i++) {
    let zi = {};
    let string = lunaArray[1] + "-" + lunaArray[0] + "-" + i + " UTC";
    let d = new Date(string);
    switch (weekday[d.getDay()]) {
      case "Monday":
        zi.prescurtare = "L";
        if (jum === "1" && i <= 15) {
          oNorma = addTimes(oNorma, "8:30");
        } else if (jum === "2") {
          oNorma = addTimes(oNorma, "8:30");
        }

        break;
      case "Tuesday":
        zi.prescurtare = "Ma";
        if (jum === "1" && i <= 15) {
          oNorma = addTimes(oNorma, "8:30");
        } else if (jum === "2") {
          oNorma = addTimes(oNorma, "8:30");
        }
        break;
      case "Wednesday":
        zi.prescurtare = "Mi";
        if (jum === "1" && i <= 15) {
          oNorma = addTimes(oNorma, "8:30");
        } else if (jum === "2") {
          oNorma = addTimes(oNorma, "8:30");
        }
        break;
      case "Thursday":
        zi.prescurtare = "J";
        if (jum === "1" && i <= 15) {
          oNorma = addTimes(oNorma, "8:30");
        } else if (jum === "2") {
          oNorma = addTimes(oNorma, "8:30");
        }
        break;
      case "Friday":
        zi.prescurtare = "V";
        if (jum === "1" && i <= 15) {
          oNorma = addTimes(oNorma, "6:00");
        } else if (jum === "2") {
          oNorma = addTimes(oNorma, "6:00");
        }
        break;
      case "Saturday":
        zi.prescurtare = "S";
        break;
      case "Sunday":
        zi.prescurtare = "D";
        break;
    }

    if (i < 10) {
      zi.numar = `0${i}`;
    } else {
      zi.numar = `${i}`;
    }

    zile.push(zi);
  }

  return { zile, oNorma };
}

function getOre(ultima_zi, pontaje) {
  let ore = [];
  let orePontat = [];
  let tichete = 0;
  let zCM = 0;
  let zCO = 0;
  let NEM = "";
  let AM = "";
  let SIND = "";
  let CM = "";
  let CO = "";
  let COR = "";
  let DEL = "";
  let SUSP = "";
  let DFD = "";
  let DET = "";
  let PRB = "";
  let REC = "";
  let T = "";
  let CC12 = "";
  let CCM = "";
  let oPCeas = "00:00";
  let zDDiurna = "";
  let zSUSP = 0;
  let oIFP = "";
  let zFP = 0;

  // console.log(pontaje);

  //??
  let oSUPL = "";
  //??

  for (let i = 1; i <= ultima_zi; i++) {
    let ora = {};
    ora.oraI = "";
    ora.oraE = "";
    ore.push(ora);

    let oraPon = {};
    oraPon.oraR = "";
    oraPon.oraC = "";
    orePontat.push(oraPon);
  }

  for (let j = 0; j < pontaje.length; j++) {
    let zi = pontaje[j].DATA_PONTAJ.split("/")[0];
    if (zi[0] == 0) {
      zi = zi[1];
    }
    var gasit = false;
    if (pontaje[j].ORA_I !== null && pontaje[j].ORA_I !== "null") {
      ore[zi - 1].oraI = pontaje[j].ORA_I;
      if (ore[zi - 1].oraI.search(":") >= 0) {
        gasit = true;
      }

      switch (pontaje[j].ORA_I) {
        case "CO":
          if (CO === "") {
            CO = 1;
          } else {
            CO++;
          }
          zCO++;
          break;
        case "CM":
          if (CM === "") {
            CM = 1;
          } else {
            CM++;
          }
          zCM++;
          break;
        case "NEM":
          if (NEM === "") {
            NEM = 1;
          } else {
            NEM++;
          }
          break;
        case "AM":
          if (AM === "") {
            AM = 1;
          } else {
            AM++;
          }
          break;
        case "SIND":
          if (SIND === "") {
            SIND = 1;
          } else {
            SIND++;
          }
          break;
        case "COR":
          if (COR === "") {
            COR = 1;
          } else {
            COR++;
          }
          break;
        case "SUSP":
          if (SUSP === "") {
            SUSP = 1;
          } else {
            SUSP++;
          }
          zSUSP++;
          break;
        case "DFD":
          if (DFD === "") {
            DFD = 1;
          } else {
            DFD++;
          }
          break;
        case "DET":
          if (DET === "") {
            DET = 1;
          } else {
            DET++;
          }
          break;
        case "DEL":
          if (zDDiurna === "") {
            zDDiurna = 1;
          } else {
            zDDiurna++;
          }
          if (DEL === "") {
            DEL = 1;
          } else {
            DEL++;
          }
          break;
        case "PRB":
          if (PRB === "") {
            PRB = 1;
          } else {
            PRB++;
          }
          break;
        case "REC":
          if (REC === "") {
            REC = 1;
          } else {
            REC++;
          }
          break;
        case "CCM":
          if (CCM === "") {
            CCM = 1;
          } else {
            CCM++;
          }
          break;
        case "T":
          if (T === "") {
            T = 1;
          } else {
            T++;
          }
          break;
        case "CC12":
          if (CC12 === "") {
            CC12 = 1;
          } else {
            CC12++;
          }
          break;
        case "IFP":
          if (oIFP === "") {
            oIFP = 1;
          } else {
            oIFP++;
          }
          zFP++;
          break;
      }
    }

    if (pontaje[j].ORA_E !== null && pontaje[j].ORA_E !== "null") {
      ore[zi - 1].oraE = pontaje[j].ORA_E;
      if (!gasit) {
        if (ore[zi - 1].oraE.search(":") >= 0) {
          gasit = true;
        }
      }
    }

    if (
      gasit === true ||
      pontaje[j].ORA_I === "T" ||
      pontaje[j].ORA_I === "DFD"
    ) {
      tichete++;
    }

    if (pontaje[j].PONTAT_REAL !== null && pontaje[j].PONTAT_REAL !== "null") {
      orePontat[zi - 1].oraR = pontaje[j].PONTAT_REAL;
      if (orePontat[zi - 1].oraR === "10+") {
        oPCeas = addTimes(oPCeas, "10:00");
      } else {
        oPCeas = addTimes(oPCeas, pontaje[j].PONTAT_REAL);
      }
    }

    if (
      pontaje[j].PONTAT_CONFIRMAT !== null &&
      pontaje[j].PONTAT_CONFIRMAT !== "null"
    ) {
      //aici
      orePontat[zi - 1].oraC = pontaje[j].PONTAT_CONFIRMAT;
    }
  }

  return {
    ore: ore,
    orePontat: orePontat,
    tichete: tichete,
    oPCeas: oPCeas,
    zCM: zCM,
    zCO: zCO,
    zFP: zFP,
    oSUPL: oSUPL,
    zSUSP: zSUSP,
    NEM: NEM,
    AM: AM,
    SIND: SIND,
    CM: CM,
    CO: CO,
    COR: COR,
    DEL: DEL,
    oIFP: oIFP,
    SUSP: SUSP,
    DFD: DFD,
    DET: DET,
    PRB: PRB,
    REC: REC,
    CCM: CCM,
    CC12: CC12,
    T: T,
    zDDiurna: zDDiurna
  };
}

function timeConvert(n) {
  var num = n;
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);

  return rhours + ":" + rminutes;
}

function calculeazaOPCeas(oraP, timpP) {
  let ora = oraP.split(":");
  let timp = timpP.split(":");
  console.log(ora);

  let minute = 0;

  minute = minute + ora[0] * 60;

  if (ora[1][0] === 0) {
    minute = ora[1][1] + minute;
  } else {
    minute = ora[1] + minute;
  }

  if (timp[0][0] === 0) {
    minute = timp[0][1] * 60;
  } else {
    minute = timp[0] * 60;
  }
  if (timp[1][0] === 0) {
    minute = timp[1][1] + minute;
  } else {
    minute = timp[1] + minute;
  }

  console.log(minute);

  let data = timeConvert(minute);

  return data;
}

function addTimes(startTime, endTime) {
  var times = [0, 0, 0];
  var max = times.length;

  var a = (startTime || "").split(":");
  var b = (endTime || "").split(":");

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (var i = 0; i < max; i++) {
    times[i] = a[i] + b[i];
  }

  var hours = times[0];
  var minutes = times[1];
  var seconds = times[2];

  if (seconds >= 60) {
    var m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    var h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  if (hours >= 100) {
    return ("0" + hours).slice(-3) + ":" + ("0" + minutes).slice(-2);
  } else {
    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
  }
}

function comparaOreVineri(timp) {
  if (timp === null || timp === "null") {
    return false;
  }
  if (timp === "10+") {
    return true;
  }
  if (timp.search(":") < 0) {
    return false;
  }

  var str1 = timp,
    str2 = "6:00";

  if (str1 > str2) return true;
  else return false;
}

function comparaOreSapt(timp) {
  if (timp === null || timp === "null") {
    return false;
  }
  if (timp === "10+") {
    return true;
  }
  if (timp.search(":") < 0) {
    return false;
  }
  var str1 = timp,
    str2 = "8:30";

  if (str1 > str2) return true;
  else return false;
}
