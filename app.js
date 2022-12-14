const express = require('express');
const app = express();
const {
    getTopic,
    getArticle,
    getArticleById
} = require('./controllers')
const {
    notFound,
    handleCustomError,
    handle500Error
} = require('./controllers.err');

app.get('/api/topic', getTopic);
app.get('/api/articles', getArticle);
app.get('/api/articles/:article_id', getArticleById);

app.all('/*', notFound);

app.use(handleCustomError);

app.use(handle500Error);

module.exports = {app}