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

exports.fetchArticles = () => {
    return db.query(`SELECT articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.body,
    articles.created_at,
    articles.votes,                
    count(comments.body)::INTEGER AS comment_count
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
        .then((articles) => {
            if (articles.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'No article found'
                });
            };
            return articles.rows
        });
};

exports.fetchArticleComments = (articleID) => {
    return db.query(`SELECT title FROM articles WHERE article_id = $1`, [articleID])
        .then((title) => {
            if (title.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'No article found'
                })
            } else {
                return db.query(`SELECT comment_id, article_id,
                votes, created_at, author, body
                FROM comments
                WHERE article_id = $1`, [articleID])
                    .then((comments) => {
                        return comments;
                    });
            };
        });
};

exports.insertComment = (newComment, articleID) => {
    const { username, body } = newComment
    return db.query(`SELECT username FROM users WHERE username = $1`, [username])
        .then((user) => {
            if (user.rows.length === 0) {
                return { msg: "User not found" }
            } else {
                return db.query('SELECT article_id FROM articles WHERE article_id = $1', [articleID])
                    .then((article) => {
                        if (article.rows.length === 0) {
                            return Promise.reject({
                                status: 404,
                                msg: 'Article not found'
                            })
                        } else {
                            return db.query(`INSERT INTO comments (author, body, article_id)
                                            VALUES ($1, $2, $3)
                                            RETURNING *;`, [username, body, articleID])
                                .then((comment) => {
                                    return comment;
                                });
                        };
                    });
            };
        });
};