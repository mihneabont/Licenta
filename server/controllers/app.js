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
  ('Starting application');
  try {
    ('Initializing database module');
 
    await database.initialize(); 
  } catch (err) {
    console.error(err);
 
    process.exit(1); // Non-zero failure code
  }
 
  try {
    ('Initializing web server module');
 
    await webServer.initialize();
  } catch (err) {
    console.error(err);
 
    process.exit(1); // Non-zero failure code
  }
}
 
startup();