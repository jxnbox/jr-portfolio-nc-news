const db = require('./db/connection');



exports.getTopicModel = () => {
    return db.query('SELECT * FROM topics;')
        .then( (topics) => {
            return topics.rows;
        })
}

exports.getArticleModel = () => {
    return db.query('SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
    .then( (articles) => {
        return articles.rows;
    })
};

exports.getArticleByIdModel = (article_id) => {    
    return db.query('SELECT * FROM articles WHERE article_id = $1 ;', [article_id])
    .then((article) => {
        if (article.rows.length !== 0) {
            return article.rows[0];
        } else {
            return Promise.reject({status: 404, msg : 'Not Found'});
        }
    })
}

exports.getCommentsByIdModel = (article_id) => {

    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
    .then((article) => {
            return article.rows;
    })
}