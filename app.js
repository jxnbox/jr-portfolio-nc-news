const express = require('express');
const app = express();
const {getTopic} = require('./controllers')
const {notFound} = require('./controllers.err')

app.use(express.json());

app.get('/api/topic', getTopic)

app.all('/*', notFound)

module.exports = {app}