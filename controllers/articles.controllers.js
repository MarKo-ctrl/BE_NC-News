const {
  fetchArticleById,
  updateArticleByID,
  fetchArticles,
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
  const { sort_by, order, topic, page } = req.query;

  fetchArticles(sort_by, order, topic, page)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

