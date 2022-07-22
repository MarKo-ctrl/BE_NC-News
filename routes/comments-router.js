const commentsRouter = require('express').Router();
const { 
    deleteComment,
    patchCommentVote,
} = require('../controllers/comments.controllers')

commentsRouter.delete('/:comment_id', deleteComment);
commentsRouter.patch('/:comment_id', patchCommentVote);

module.exports = commentsRouter;