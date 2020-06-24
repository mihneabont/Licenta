const express = require("express");
const router = new express.Router();
const autentificare = require("../controllers/autentificare.js");
const angajati = require("../controllers/angajati.js");
const sarbatori = require("../controllers/sarbatori.js");
const aparate = require("../controllers/aparate.js");
const judete = require("../controllers/judete.js");
const departamente = require("../controllers/departamente.js");
const locatii = require("../controllers/locatii.js");
const angajatipublic = require("../controllers/angajatipublic.js");
const fileUpload = require("../controllers/fileUpload.js");
const calendarAngajat = require("../controllers/calendarAngajat.js");
const downloadPdf = require("../controllers/downloadPdf.js");
const confirmareDep = require("../controllers/confirmareDep.js");

router.route("/angajati/:id?").get(angajati.get);
router.route("/angajati").post(angajati.post);
router.route("/angajati").put(angajati.put);
router.route("/angajati/:id?").delete(angajati.delete);

router.route("/sarbatori/").get(sarbatori.get);
router.route("/sarbatori/").post(sarbatori.post);

router.route("/aparate/").post(aparate.post);
router.route("/aparate/register").post(aparate.registerAparat);
router.route("/aparate/token").get(aparate.getToken);

router.route("/judete/:id?").get(judete.get);
router.route("/departamente/:id_loc?/:id_dep?").get(departamente.get);
router.route("/departamenteDinLoc/:id?").get(departamente.get2);
router.route("/locatii/:id?").get(locatii.get);


router.route("/autentificare").post(autentificare.post);
router.route("/schimbaParola").post(autentificare.schimbaParola);

router.route("/angajatipublic/:id?").get(angajatipublic.get);

router.route("/calendarAngajat/:id?/:date?").get(calendarAngajat.get);
router.route("/calendarAngajatConfirmat/:id?/:date?").get(calendarAngajat.getConfirmat);
router.route("/calendarAngajatSuper/:id?").put(calendarAngajat.put);
router.route("/calendarAngajat/:id?").put(calendarAngajat.put2);

router.route("/create-pdf").post(downloadPdf.post);
router.route("/create-pdf-locatie").post(downloadPdf.post2);
router.route("/create-pdf-locatie-dep").post(downloadPdf.post3);
router.route("/fetch-pdf").get(downloadPdf.get);
router.route("/ghid").get(downloadPdf.get2);

router.route("/confirmareDep/:id?/:date?").post(confirmareDep.post);
router.route("/confirmareLocatie/:id?/:date?").post(confirmareDep.post2);
router.route("/confirmareLocatieDepart/:id_loc?/:id_dep?/:date?").post(confirmareDep.post3);

router.route("/upload").post(fileUpload.post);

module.exports = router;
