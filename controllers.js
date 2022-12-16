const {
    getTopicModel,
    getArticleModel,
    getArticleByIdModel,
    getCommentsByIdModel,
    postCommentByIdModels
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
        res.status(200).send({articles});
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    
    getArticleByIdModel(article_id)
    .then( (article) => {
        res.status(200).send({article});
    })
    .catch(next);
}

exports.getCommentsById = (req, res, next) => {
    const article_id = req.params.article_id;

    getCommentsByIdModel(article_id)
    .then( (comments) => {
        res.status(200).send(comments);
    })
    .catch(next);
}

exports.postCommentById = (req, res, next) => {
    const article_id = req.params.article_id;
    const newComment = req.body;

    postCommentByIdModels(article_id, newComment)
    .then( (comment) => {
        res.status(201).send({comment});
    })
    .catch(next);
}