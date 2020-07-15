const calendarAngajat = require('../db_apis/calendarAngajat.js');
const utilizatori =  require('../db_apis/utilizatori.js');
const config = require("../config/token.js");
var jwt = require('jsonwebtoken');

async function getConfirmat(req, res, next) {
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
  const context = {};
  
  context.id = parseInt(req.params.id, 10);
  if(req.params.date){
    context.date = req.params.date.replace("-", "/");
  }
  
  const rows = await calendarAngajat.createSelectCalendarConfirmat(context);
  if (rows) {
    res.status(200).json(rows);
  } else {
    res.status(404).end();
  }
    
  } catch (err) {
    next(err);
  }
}
 
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
        if (e.name === 'TokenExpiredError') {
          res.status(401).send({message: 'Token Expired'});
        } else {
            res.status(401).send({message: 'Authentication failed'});
        }
        return;
      }
    }
    const context = {};
    
    context.id = parseInt(req.params.id, 10);
    if(req.params.date){
      context.date = req.params.date.replace("-", "/");
    }
    
    const rows = await calendarAngajat.createSelectCalendar(context);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.status(404).end();
    }
    
  } catch (err) {
    next(err);
  }
}



async function put(req, res,next) {
  try {
    var token;
    
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }
  
    token = req.headers.authorization;
  
    try {
        let payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            res.status(401).send({message: 'Token Expired'});
        } else if(e.name === "JsonWebTokenError"){
            res.status(401).send({message: 'Not Super Admin'});
        } else {
            res.status(401).send({message: 'Authentication failed'});
        }
        return;
    }

    const context = {};
 
    context.id = parseInt(req.params.id, 10);

    angajatBD = await calendarAngajat.updateSuperAdmin(context.id, req.body);
  
    if (angajatBD !== null) {
      res.status(200).json(angajatBD);
    } else {
      res.status(404).json("Update failed");
    }
  } catch (err) {
    next(err);
  }
}

async function put2(req, res,next) {
  try {
    var token;
    
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }
  
    token = req.headers.authorization;
    let payload;
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

    const context = {};
 
    context.id = parseInt(req.params.id, 10);
    const locUtilizator = await utilizatori.getLocatieUtilizator(payload.idSalariat);
    const locAngajat = await utilizatori.getLocatieUtilizator(context.id);
    if( Object.entries(locUtilizator).toString() === Object.entries(locAngajat).toString()){
    angajatBD = await calendarAngajat.updateAdmin(context.id, req.body);
    }
  
    if (angajatBD !== null) {
      res.status(200).json(angajatBD);
    } else {
      res.status(404).json("Update failed");
    }
  } catch (err) {
    next(err);
  }
}
  
  
module.exports = {
  get: get,
  getConfirmat,
  put: put,
  put2: put2
};