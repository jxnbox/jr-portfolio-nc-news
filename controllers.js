const {getTopicModel} = require('./models')

exports.getTopic = (req, res, next) => {
    getTopicModel()
    .then((topics) => {
        res.status(200).send(topics);
    })
    .catch( (err) => {
        next(err);
    })

}