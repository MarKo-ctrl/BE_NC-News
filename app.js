const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const {
    getArticleByID,
    patchArticleByID,
    getArticles,
    getArticleComments,
} = require('./controllers/articles.controllers');
const { postComment, deleteComment } = require('./controllers/comments.controllers')
const { getUsers } = require('./controllers/users.controllers');
const { handleInvalidRoutes } = require('./controllers/errors/errors.controllers');
const {
    handleCustomServerErrors,
    handleServerErrors,
    handlePSQLError
} = require('./models/errors/errors.models')
const { getDesc } = require('./controllers/description.controllers.js');

const app = express();

app.use(express.json());

app.get('/api', getDesc)
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleByID);
app.patch('/api/articles/:article_id', patchArticleByID);
app.get('/api/users', getUsers)
app.get('/api/articles/:article_id/comments', getArticleComments);
app.post('/api/articles/:article_id/comments', postComment);
app.delete('/api/comments/:comment_id', deleteComment)

app.all('/*', handleInvalidRoutes);
app.use(handleCustomServerErrors);
app.use(handlePSQLError);
app.use(handleServerErrors);

module.exports = app;