exports.notFound = (req, res, next) => {
    res.status(404).send({msg : 'Not Found'});
}

exports.handleCustomError = (err, req, res, next) => {
    res.status(400).send({ msg: "Bad Request" });
  };