const express = require('express');
const app = express();
const {
    getTopic,
    getArticle,
    getArticleById
} = require('./controllers')
const {
    notFound,
    handleCustomError
} = require('./controllers.err');

app.get('/api/topic', getTopic);
app.get('/api/articles', getArticle);
app.get('/api/articles/:article_id', getArticleById);

app.all('/*', notFound);

app.use(handleCustomError);

module.exports = {app}