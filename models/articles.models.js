const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT articles.article_id,
                    articles.title,
                    articles.topic,
                    articles.author,
                    articles.body,
                    articles.created_at,
                    articles.votes,                
                    count(comments.body) AS comment_count
                    FROM articles
                    JOIN comments
                    ON articles.article_id = comments.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id`,
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
    if (!inc_votes) {
        return Promise.reject({ status: 400, msg: 'Invalid request' });
    } else if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: 'Invalid request - requested update is not a number' });
    } else {
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
};