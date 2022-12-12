const {
    getTopicModel,
    getArticleModel
} = require('./models')

exports.getTopic = (req, res, next) => {
    getTopicModel()
    .then((topics) => {
        res.status(200).send(topics);
    })
    .catch(next);
}

exports.getArticle = (req, res, next) => {
    getArticleModel()
    .then((articles) => {
        console.log(articles)
        res.status(200).send(articles);
    })
    .catch(next);
}