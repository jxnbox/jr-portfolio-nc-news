const {
    getTopicModel,
    getArticleModel,
    getArticleByIdModel,
    getCommentsByIdModel,
    postCommentByIdModels,
    postNewUser,
    patchVoteByIdModels,
    getUsersModel,
    getAllArticlesIdModel
} = require('./models')

exports.getTopic = (req, res, next) => {
    getTopicModel()
    .then((topics) => {
        res.status(200).send(topics);
    })
    .catch(next);
}

exports.getArticle = (req, res, next) => {
    if (!req.query) {
        getArticleModel()
        .then((articles) => {
            res.status(200).send({articles});
        })
        .catch(next);
    } else {
        getArticleModel(req.query)
        .then((articles) => {
            res.status(200).send({articles});
        })
        .catch(next);
    }
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

exports.postNewUser = (req, res, next) => {
    const newUser = req.body;

    postNewUser(newUser)
    .then( (user) => {
        res.status(201).send({user})
    })
    .catch(next)
}

exports.patchVoteById = (req, res, next) => {
    const article_id = req.params.article_id;
    const incVotes = req.body;

    patchVoteByIdModels(article_id, incVotes)
    .then( (article) => {
        res.status(202).send({article})
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {

    getUsersModel()
    .then( (users) => {
        res.status(200).send(users)
    })
    .catch(next);
}

exports.getAllArticlesId = (req, res, next) => {

    getAllArticlesIdModel()
    .then( (article_id) => {
        res.status(200).send({articles: [article_id]})
    })
    .catch(next);

}