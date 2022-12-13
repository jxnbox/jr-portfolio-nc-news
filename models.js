const db = require('./db/connection');
const articles = require('./db/data/test-data/articles');

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
