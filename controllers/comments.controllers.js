const { 
    insertComment,
    purgeComment,
    fetchArticleComments,
    updateCommentVote
} = require('../models/comments.models');

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleComments(article_id)
        .then((comments) => {
            res.status(200).send(comments);
        })
        .catch(next);
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params
    const body = req.body
    insertComment(body, article_id)
        .then((comment) => {
            res.status(201).send(comment)
        })
        .catch(next)
};

exports.deleteComment = (req, res, next) => {
    const commentID = req.params;
    purgeComment(commentID)
        .then(() => res.sendStatus(204))
        .catch(next)
};

exports.patchCommentVote = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    updateCommentVote(comment_id, inc_votes)
        .then((comment) => res.status(200).send(comment))
        .catch(next);
};