const confirmareDep = require('../db_apis/confirmareDep.js');
const config = require("../config/token.js");
var jwt = require('jsonwebtoken');
 
async function post(req, res,next) {
  try {
    var token;
    
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }
  
    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
      try {
          let payload = jwt.verify(token, config.jwtSecretKey_admin);
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
    const context = {};
  
    context.id = parseInt(req.params.id, 10);
    if(req.params.date){
      context.date = req.params.date.replace("-", "/");
    }

    updateDepart = await confirmareDep.confirmaPontaje(context);
  
    if (updateDepart !== null) {
      res.status(200).json(updateDepart);
    } else {
      res.status(404).json("Update failed");
    }
  } catch (err) {
    next(err);
  }
}


async function post2(req, res,next) {
  try {
    var token;
    
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }
  
    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
      try {
          let payload = jwt.verify(token, config.jwtSecretKey_admin);
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
    const context = {};
  
    context.id = parseInt(req.params.id, 10);
    if(req.params.date){
      context.date = req.params.date.replace("-", "/");
    }

    updateDepart = await confirmareDep.confirmaPontajeLocatie(context);
  
    if (updateDepart !== null) {
      res.status(200).json(updateDepart);
    } else {
      res.status(200).json("Update failed");
    }
  } catch (err) {
    next(err);
  }
}

async function post3(req, res,next) {
  try {
    var token;
    
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }
  
    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey_superAdmin);
    } catch (e) {
      try {
          let payload = jwt.verify(token, config.jwtSecretKey_admin);
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
    const context = {};
    console.log(req.params);
    context.id_depart = parseInt(req.params.id_dep, 10);
    context.id_locatie = parseInt(req.params.id_loc, 10);
    if(req.params.date){
      context.date = req.params.date.replace("-", "/");
    }

    updateDepart = await confirmareDep.confirmarePontajeDinDepSiLocatie(context);
  
    if (updateDepart !== null) {
      res.status(200).json(updateDepart);
    } else {
      res.status(200).json("Update failed");
    }
  } catch (err) {
    next(err);
  }
}
  
module.exports = {
  post: post,
  post2: post2,
  post3: post3
};