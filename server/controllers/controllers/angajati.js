const angajati = require('../db_apis/angajati.js');
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
 
    const rows = await angajati.createselecteazaAngajati(context);
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

function getAuthFromReq(req) {
  const angajat = {
    id_angajat: req.body.id_angajat,
    nume: req.body.nume,
    prenume: req.body.prenume,
    marca: req.body.marca,
    cnp: req.body.cnp,
    data_inceput: req.body.data_inceput,
    data_sfarsit: req.body.data_sfarsit,
    judet: req.body.judet,
    locatia: req.body.locatia,
    departament: req.body.departament,
    cod_cartela: req.body.cod_cartela
  };

  if(angajat.data_inceput === null){
    angajat.data_inceput = "";
  }

  if(angajat.data_sfarsit === null){
    angajat.data_sfarsit = "";
  }

  if(angajat.judet === ""){
    angajat.judet = null;
  }

  if(angajat.locatia === ""){
    angajat.locatia = null;
  }

  if(angajat.departament === ""){
    angajat.departament = null;
  }

  if(angajat.cnp === ""){
    angajat.cnp = null;
  }

  if(angajat.marca === ""){
    angajat.marca = null;
  }

  return angajat;
}

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
    let angajat = getAuthFromReq(req);

    angajatBD = await angajati.insertAngajat(angajat);
    if(angajatBD) {
       res.status(200).json("Success. " + angajatBD + " rows added.");
    } else {
       res.status(401).json("Insert failed");
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
    let angajat = getAuthFromReq(req);

    angajatBD = await angajati.update(angajat);
  
    if (angajatBD !== null) {
      res.status(200).json(angajatBD);
    } else {
      res.status(404).json("Update failed");
    }
  } catch (err) {
    next(err);
  }
}

async function del(req, res,next) {
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
    const id = parseInt(req.params.id, 10);
 
    const success = await angajati.delete(id);
     
    if (success) {
      res.status(200).json(`Angajatul ${id} a fost sters.`);
    } else {
      res.status(401).json("Stergere esuata.");
    }
  
  } catch (err) {
    next(err);
  }
}

module.exports = {
  get: get,
  post: post,
  put: put,
  delete: del
};
