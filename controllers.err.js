exports.notFound = (req, res, next) => {
    res.status(404).send({msg : 'Path not found'});
}

exports.errorHandler = (err, req, res, next) => {
    
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad Request" });
    } else if (err.message === "undefined") {
      res.status(err.status).send({ msg: err.message });
    } else {
      res.sendStatus(500);
    }
  };