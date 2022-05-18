const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT *
                    FROM articles
                    WHERE article_id = $1`,
        [article_id])
        .then((article) => {
            if (article.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'Article not found'
                });
            };
            return article.rows
        })
};

exports.updateArticleByID = (article_id, inc_votes) => {
    return db.query(`UPDATE articles
                    SET votes = votes + $2
                    WHERE article_id = $1
                    RETURNING *;`,
        [article_id, inc_votes])
        .then((article) => {
            if (article.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'Article not found'
                });
            };
            return article.rows[0];
        });
};