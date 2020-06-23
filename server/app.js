const express = require("express");
const database = require('./services/database.js');

const app = express();

const oracledb = require("oracledb");
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4;
 
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


//Middleware

const webServer = require('./services/webserver.js');
 
async function startup() {
  console.log('Aplicația pornește');
  try {
    console.log('Initializare baza de date');
 
    await database.initialize(); 
  } catch (err) {
    console.error(err);
 
    process.exit(1);
  }
 
  try {
    console.log('Initializare server...');
 
    await webServer.initialize();
  } catch (err) {
    console.error(err);
 
    process.exit(1);
  }
}
 
startup();