const departamente = require("../db_apis/departamente.js");
const config = require("../config/token.js");
var jwt = require("jsonwebtoken");

async function get(req, res, next) {
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
        try {
          payload = jwt.verify(token, config.jwtSecretKey);
        } catch (e) {
          if (e.name === "TokenExpiredError") {
            res.status(401).send({ message: "Token Expired" });
          } else {
            res.status(401).send({ message: "Authentication failed" });
          }
          return;
        }
      }
    }

    const context = {};

    context.id_dep = parseInt(req.params.id_dep, 10);
    context.id_loc = parseInt(req.params.id_loc, 10);

    const rows = await departamente.createSelecteazaDepartamente(context);
    if (req.params.id) {
      if (rows) {
        res.status(200).json(rows);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

async function get2(req, res, next) {
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
        try {
          payload = jwt.verify(token, config.jwtSecretKey);
        } catch (e) {
          if (e.name === "TokenExpiredError") {
            res.status(401).send({ message: "Token Expired" });
          } else {
            res.status(401).send({ message: "Authentication failed" });
          }
          return;
        }
      }
    }

    const context = {};

    context.id = parseInt(req.params.id, 10);

    const rows = await departamente.selecteazaDepartamentDupaLocatie(context);
    if (req.params.id) {
      if (rows) {
        res.status(200).json(rows);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { get: get, get2: get2 };
