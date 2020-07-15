const utilizatori = require('../db_apis/utilizatori.js');
const config = require("../config/token.js");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

function getAuthFromReq(req) {
  const utilizator = {
    nume_utilizator: req.body.nume_utilizator,
    parola: req.body.parola
  };

  return utilizator;
}

async function post(req, res,next) {
  try {
    let utilizator = getAuthFromReq(req);
    utilizatorBD = await utilizatori.createSelecteazaUtilizator(utilizator);
    (utilizatorBD);

    if(utilizatorBD.length === 0){
        return res.status(401).json({ error: 'Invalid login'})
    }

    let compare =  await bcrypt.compare(utilizator.parola, utilizatorBD[0].PAROLA).then(function(res) {
      return res;
    });
    if( !compare){
      if(utilizator.parola !== utilizatorBD[0].PAROLA){
        return res.status(401).json({ error: 'Invalid login'})
      }
    }

    if(utilizatorBD[0].ADMIN === 0){
      res.status(200).json({
        data:{id: utilizatorBD[0].ID_UTILIZATOR, nume:utilizatorBD[0].NUME_UTILIZATOR, admin:utilizatorBD[0].ADMIN, judet:utilizatorBD[0].ID_N_JUDET, idAngajat: utilizatorBD[0].ID_SALARIAT },
        token: jwt.sign({exp: Math.floor(Date.now() / 1000) + (300 * 60),
          id_utilizator:utilizatorBD[0].ID_UTILIZATOR, idSalariat: utilizatorBD[0].ID_SALARIAT}, config.jwtSecretKey)
      });
    } else if (utilizatorBD[0].ADMIN === 1) {
      res.status(200).json({
        data:{id: utilizatorBD[0].ID_UTILIZATOR, nume:utilizatorBD[0].NUME_UTILIZATOR, admin:utilizatorBD[0].ADMIN, judet:utilizatorBD[0].ID_N_JUDET, idAngajat: utilizatorBD[0].ID_SALARIAT  },
        token: jwt.sign({exp: Math.floor(Date.now() / 1000) + (300 * 60),
          id_utilizator:utilizatorBD[0].ID_UTILIZATOR, idSalariat: utilizatorBD[0].ID_SALARIAT}, config.jwtSecretKey_admin)
      });
    } else if(utilizatorBD[0].ADMIN === 2) {
      res.status(200).json({
        data:{id: utilizatorBD[0].ID_UTILIZATOR, nume:utilizatorBD[0].NUME_UTILIZATOR, admin:utilizatorBD[0].ADMIN, judet:utilizatorBD[0].ID_N_JUDET, idAngajat: utilizatorBD[0].ID_SALARIAT  },
        token: jwt.sign({exp: Math.floor(Date.now() / 1000) + (300 * 60),
          id_utilizator:utilizatorBD[0].ID_UTILIZATOR, idSalariat: utilizatorBD[0].ID_SALARIAT}, config.jwtSecretKey_superAdmin)
      });
    }
    
} catch (err) {
    next(err);
  }
}

async function schimbaParola(req, res ,next) {
  try {

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

    context.idUtilizator = payload.id_utilizator;
    context.parolaActuala = req.body.parolaActuala;
    context.parolaNoua = req.body.parolaNoua;

    utilizatorBD = await utilizatori.schimbaParola(context);
    (utilizatorBD);

    if(utilizatorBD === `Wrong password`) {
      return res.status(403).json({ error: `Wrong password`})
    }

    return res.status(200).json('Update reusit.');
    
} catch (err) {
    next(err);
  }
}

module.exports = {
  post: post,
  schimbaParola: schimbaParola
};
