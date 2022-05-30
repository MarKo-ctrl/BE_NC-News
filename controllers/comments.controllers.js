const { insertComment, purgeComment } = require('../models/comments.models');

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