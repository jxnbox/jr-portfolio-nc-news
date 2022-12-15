const express = require('express');
const app = express();
const {
    getTopic,
    getArticle,
    getArticleById,
    getCommentsById
} = require('./controllers')
const {
    notFound,
    handleCustomError,
    handle500Error,
    handlePSQLError
} = require('./controllers.err');

app.get('/api/topic', getTopic);
app.get('/api/articles', getArticle);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsById);



app.all('/*', notFound);
app.use(handleCustomError);
app.use(handlePSQLError);
app.use(handle500Error);

module.exports = {app}