const topicRouter = require('express').Router();
const {
    getTopics
 } = require('../controllers/topics.controllers');

 topicRouter.get('/', getTopics);

 module.exports = topicRouter;