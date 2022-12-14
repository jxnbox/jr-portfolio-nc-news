exports.notFound = (req, res, next) => {
    res.status(404).send({msg : 'Not Found'});
}

exports.handleCustomError = (err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    } else if (err.rows.length === 0){
        res.status(404).send({msg : 'Not Found'});
    } else {
        next(err);
    }
  };

exports.handle500Error = (err, req, res, next) => {
    if (err) res.status(500).send({ msg: "Internal Server Error" });
  };