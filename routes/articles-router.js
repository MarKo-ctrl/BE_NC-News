const articleRouter = require('express').Router();
const {
    getArticleByID,
    patchArticleByID,
    getArticles,
} = require('../controllers/articles.controllers');
const { 
    postComment,
    getArticleComments,
} = require('../controllers/comments.controllers')



articleRouter.get('/:article_id/', getArticleByID);
articleRouter.get('/', getArticles);
articleRouter.patch('/:article_id/', patchArticleByID);
articleRouter.get('/:article_id/comments', getArticleComments);
articleRouter.post('/:article_id/comments', postComment);


module.exports = articleRouter;