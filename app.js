const cors = require('cors')
const express = require('express');
const app = express();
const {
    getTopic,
    getArticle,
    getArticleById,
    getCommentsById,
    postCommentById,
    postNewUser,
    patchVoteById,
    getUsers,
    getArticleQuery
} = require('./controllers')
const {
    notFound,
    handleCustomError,
    handle500Error,
    handlePSQLError
} = require('./controllers.err');

app.use(express.json());
app.use(cors());

app.get('/api/topic', getTopic);
app.get('/api/articles', getArticle);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsById);
app.get('/api/users', getUsers)

app.get('/api/articles?', getArticleQuery)

app.post('/api/users', postNewUser)
app.post('/api/articles/:article_id/comments', postCommentById)

app.patch('/api/articles/:article_id', patchVoteById)

app.all('/*', notFound);
app.use(handleCustomError);
app.use(handlePSQLError);
app.use(handle500Error);

module.exports = {app}