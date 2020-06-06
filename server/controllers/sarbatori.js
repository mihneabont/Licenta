const sarbatori = require('../db_apis/sarbatori.js');
const config = require("../config/token.js");
var jwt = require('jsonwebtoken');
 
async function get(req, res, next) {
    try {
      var token;
      var payload;
      
      if (!req.headers.authorization) {
          return res.status(401).send({message: 'You are not authorized'});
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
              if (e.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Token Expired'});
              } else {
                  res.status(401).send({message: 'Authentication failed'});
              }
              return;
            }
        }
      }
    
        const rows = await sarbatori.getSarbatori();
      
        if (rows) {
          res.status(200).json(rows);
        } else {
          res.status(404).end();
        }
    } catch (err) {
      next(err);
    }
  }

  async function post(req, res, next) {
    try {
      var token;
      var payload;
      
      if (!req.headers.authorization) {
          return res.status(401).send({message: 'You are not authorized'});
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
              if (e.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Token Expired'});
              } else {
                  res.status(401).send({message: 'Authentication failed'});
              }
              return;
            }
        }
      }
    
      let sarbatoriBD = await sarbatori.insertSarbatoare(req.body.date);
      if(sarbatoriBD) {
         res.status(200).json("Success. " + sarbatoriBD + " rows added.");
      } else {
         res.status(401).json("Insert failed");
      }
    } catch (err) {
      next(err);
    }
  }
  
  

module.exports.get = get;
module.exports.post = post;