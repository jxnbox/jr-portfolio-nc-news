const express = require('express');
const app = express();
const {
    getTopic,
    getArticle,
    getArticleById,
    getCommentsById,
    postCommentById
} = require('./controllers')
const {
    notFound,
    handleCustomError,
    handle500Error,
    handlePSQLError
} = require('./controllers.err');

app.use(express.json());

app.get('/api/topic', getTopic);
app.get('/api/articles', getArticle);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsById);

app.post('/api/articles/:article_id/comments', postCommentById)

app.all('/*', notFound);
app.use(handleCustomError);
app.use(handlePSQLError);
app.use(handle500Error);

module.exports = {app}