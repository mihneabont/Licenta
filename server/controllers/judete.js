const judete = require('../db_apis/judete.js');
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
          payload = jwt.verify(token, config.jwtSecretKey);
        } catch (e) {
        try {
            payload = jwt.verify(token, config.jwtSecretKey_admin);
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Token Expired'});
            } else if(e.name === "JsonWebTokenError"){
            res.status(401).send({message: 'Not Admin'});
            } else {
                res.status(401).send({message: 'Authentication failed'});
            }
            return;
        }
      }
    }
      
      const context = {};
   
      context.id = parseInt(req.params.id, 10);
   
      const rows = await judete.createselecteazaJudete(context);
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
  

module.exports.get = get;