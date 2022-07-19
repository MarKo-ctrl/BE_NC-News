const deleteRouter = require('express').Router();
const { 
    deleteComment,
} = require('../controllers/comments.controllers')

deleteRouter.delete('/:comment_id', deleteComment);

module.exports = deleteRouter;