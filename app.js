const express = require('express');
const app = express();
const {
    getTopic,
    getArticle
} = require('./controllers')
const {
    notFound,
} = require('./controllers.err')

app.use(express.json());

app.get('/api/topic', getTopic)
app.get('/api/articles', getArticle)

app.all('/*', notFound)

module.exports = {app}