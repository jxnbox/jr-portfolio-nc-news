const db = require('./db/connection');
const articles = require('./db/data/test-data/articles');

exports.getTopicModel = () => {
    return db.query('SELECT * FROM topics;')
        .then( (topics) => {
            return topics.rows;
        })
}

exports.getArticleModel = () => {
    return Promise.all([
        db.query('SELECT * FROM articles ORDER BY articles.created_at DESC;')
        .then( (articles) => {
            return articles.rows;
        }),
        db.query('SELECT article_id FROM comments;')
        .then( (articles) => {
            return articles.rows;
        })
    ])
    .then( (promiseArr) => {
        promiseArr[0].forEach(article => {
            article.comment_count = 0;
            promiseArr[1].forEach(comment => {
                if (article.article_id === comment.article_id) {
                    article.comment_count++;
                }
            })
        })
        return promiseArr[0];
    })
    
};
