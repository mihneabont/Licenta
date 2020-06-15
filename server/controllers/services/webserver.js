const http = require("http");
const express = require("express");
const webServerConfig = require("../config/webserver.js");
const router = require("./router.js");
const cors = require("cors");
const bodyparser = require("body-parser");

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
    app.use(cors());
    app.use(bodyparser.json({ limit: "10mb" }));
    app.use(bodyparser.urlencoded({ extended: true, limit: "10mb" }));
    app.use("/api", router);
    httpServer.setTimeout(30*60*1000);
    httpServer
      .listen(webServerConfig.port)
      .on("listening", () => {
        console.log(
          `Web server listening on localhost:${webServerConfig.port}`
        );

        resolve();
      })
      .on("error", err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;
