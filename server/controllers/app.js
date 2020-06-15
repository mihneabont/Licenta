const express = require("express");
const database = require('./services/database.js');

const app = express();

const oracledb = require("oracledb");
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4;
 
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


//Middleware

const webServer = require('./services/webserver.js');
 
async function startup() {
  console.log('Starting application');
  try {
    console.log('Initializing database module');
 
    await database.initialize(); 
  } catch (err) {
    console.error(err);
 
    process.exit(1); // Non-zero failure code
  }
 
  try {
    console.log('Initializing web server module');
 
    await webServer.initialize();
  } catch (err) {
    console.error(err);
 
    process.exit(1); // Non-zero failure code
  }
}
 
startup();