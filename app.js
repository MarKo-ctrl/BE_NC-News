const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticleByID } = require('./controllers/articles.controllers');
const {
    handleInvalidRoutes
} = require('./controllers/errors/errors.controllers');
const {
    handleCustomServerErrors,
    handleServerErrors,
    handlePSQLError
} = require('./models/errors/errors.models')

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleByID);

app.all('/*', handleInvalidRoutes);
app.use(handleCustomServerErrors)
app.use(handlePSQLError);
app.use(handleServerErrors);

module.exports = app;