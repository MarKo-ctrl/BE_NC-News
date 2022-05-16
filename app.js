const express = require('express');
const {
    getTopics
} = require('./controllers/controllers')
const {
    handleCustomErrors
} = require('./errors/index')

const app = express();

app.get('/api/topics', getTopics)

app.all('/*', handleCustomErrors);

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('Server Error');
});

module.exports = app;