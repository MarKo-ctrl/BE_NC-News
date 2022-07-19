const apiRouter = require('express').Router();
const articleRouter = require('./articles-router');
const deleteRouter = require('./delete-router');
const topicRouter = require('./topics-router');
const usersRouter = require('./users-router');
const {
    getDesc
} = require('../controllers/description.controllers');


apiRouter.get('/', getDesc);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', deleteRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;