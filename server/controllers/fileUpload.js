const fileUplaod = require('../db_apis/fileUpload.js');
const config = require("../config/token.js");
var jwt = require('jsonwebtoken');
 
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
    
    let rowsP = req.body;
    const rows = await fileUplaod.sendAndProcessFile(rowsP);
    if (rows !== 0) {
        res.status(200).json(rows);
    } else {
        res.status(401).send({message: 'File error.'});
    }
    
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;