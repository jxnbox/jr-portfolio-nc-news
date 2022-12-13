const express = require('express');
const app = express();
const {
    getTopic,
    getArticle,
    getArticleById
} = require('./controllers')
const {
    notFound,
} = require('./controllers.err')

app.use(express.json());

app.get('/api/topic', getTopic)
app.get('/api/articles', getArticle)
app.get('/api/articles/:article_id', getArticleById)

app.all('/*', notFound)

module.exports = {app}