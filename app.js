const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticle } = require('./controllers/articles.controllers');
const {
    handleCustomErrors,
    handleInvalidRoutes
} = require('./controllers/errors/errors.controllers');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle);

app.all('/*', handleInvalidRoutes);
app.use(handleCustomErrors)
// app.use((err, req, res, next) => {
//     console.log(err)
//     res.status(500).send('Server Error');
// });

module.exports = app;