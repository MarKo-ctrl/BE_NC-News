const { fetchArticleById } = require('../models/articles.models');

exports.getArticle = (req, res, next) => {
    fetchArticleById(req.params.article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};