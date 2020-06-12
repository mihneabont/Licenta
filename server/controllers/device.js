

async function post(req, res, next) {
    
      console.log(req);
      res.status(200).json("123");
  }
  
module.exports.post = post;