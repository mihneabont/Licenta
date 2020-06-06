const locatii = require('../db_apis/locatii.js');
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

    if (req.params.id) {
        const context = {};
    
        context.id = parseInt(req.params.id, 10);
    
        const rows = await locatii.getAngajatiDinLocatie(context);
      
        if (rows) {
          res.status(200).json(rows);
        } else {
          res.status(404).end();
        }
    } else {
        res.status(404).end();
    }
    } catch (err) {
      next(err);
    }
  }
  

module.exports.get = get;