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
          payload = jwt.verify(token, config.jwtSecretKey_aparat);
        } catch (e) {
                if (e.name === 'TokenExpiredError') {
                  res.status(401).send({message: 'Token Expired'});
                } else {
                    res.status(401).send({message: 'Authentication failed'});
                }
                return;
              }
              console.log("autorizat");
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
module.exports.post = post;