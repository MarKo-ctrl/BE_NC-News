const { insertComment } = require('../models/comments.models');

exports.postComment = (req, res, next) => {
    const { article_id } = req.params
    const body = req.body
    insertComment(body, article_id)
        .then((comment) => {
            res.status(201).send(comment)
        })
        .catch(next)
};