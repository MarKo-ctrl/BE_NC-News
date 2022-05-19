const {
    fetchArticleById,
    updateArticleByID,
    fetchArticles,
    fetchArticleComments
} = require('../models/articles.models');

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleByID(article_id, inc_votes)
        .then((article) => res.status(200).send(article))
        .catch(next);
};

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then((articles) => {
            res.status(200).send(articles);
        })
        .catch(next);
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleComments(article_id)
        .then((comments) => {
            res.status(200).send(comments);
        })
        .catch(next);
}