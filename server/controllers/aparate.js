const config = require("../config/token.js");
var jwt = require('jsonwebtoken');
const aparate = require('../db_apis/aparate.js');
 
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
          payload = jwt.verify(token, config.jwtSecretKey_aparat);
        } catch (e) {
                if (e.name === 'TokenExpiredError') {
                  res.status(401).send({message: 'Token Expired'});
                } else {
                    res.status(401).send({message: 'Authentication failed'});
                }
                return;
              }
        var data = JSON.parse(req.body.JSON);
        var codCartela = data.codCartela;
        const result = await aparate.getAngajatCuCod(codCartela);
        if(result[0] && result[0].ID_SALARIAT) {
           var idSalariat = result[0].ID_SALARIAT;
           const pontajAzi = await aparate.insertOraScanata(idSalariat);
           if(pontajAzi.rowsAffected){
             res.send("Success");
           }
        }
        
  }  catch (err) {
    next(err);
  }
}

async function registerAparat(req, res, next) {
  try {
      var token;
      var payload;
      if (!req.headers.authorization) {
          return res.status(401).send({message: 'You are not authorized'});
      }
   
      token = req.headers.authorization;
      try {
        payload = jwt.verify(token, config.jwtSecretKey_aparat);
      } catch (e) {
              if (e.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Token Expired'});
              } else {
                  res.status(401).send({message: 'Authentication failed'});
              }
              return;
            }
      var data = JSON.parse(req.body.JSON);
      var adresaMAC = data.adresaMAC;
      const result = await aparate.registerAparat(adresaMAC);
      if(result) {
        res.sendStatus(200);
      }
}  catch (err) {
  next(err);
}
}

  async function getToken(req, res, next) {
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
              if (e.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Token Expired'});
              } else {
                  res.status(401).send({message: 'Authentication failed'});
              }
              return;
            }
    
        const tokenAparat = jwt.sign({aparat: 'aparat'}, config.jwtSecretKey_aparat);
        res.send({tokenAparat: tokenAparat});
    } catch (err) {
      next(err);
    }
  }

  
  

module.exports.get = get;
module.exports.getToken = getToken;
module.exports.registerAparat = registerAparat;
module.exports.post = post;