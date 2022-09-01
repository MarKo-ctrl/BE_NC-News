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

exports.fetchArticles = (sortBy, order, topic) => {
    const validCols = ['article_id', 'title', 'author', 'comment_count', 'created_at', 'votes'];
    const validTopics = ['mitch', 'cats', 'paper', 'coding', 'football', 'cooking']
    let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,                
count(comments.body)::INTEGER AS comment_count
FROM articles
JOIN comments
ON articles.article_id = comments.article_id`;

    if (topic && validTopics.includes(topic)) {
        queryString += `\nWHERE topic='${topic}'`;
    } else if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 404, msg: "Requested topic does not exist" })
    };

    queryString += `\nGROUP BY articles.article_id`;

    if (!sortBy) {
        queryString += `\nORDER BY created_at`;
    } else if (sortBy && validCols.includes(sortBy)) {
        queryString += `\nORDER BY ${sortBy}`;
    } else {
        return Promise.reject({ status: 400, msg: "Sort by column not found" })
    }

    if (order && ['asc', 'desc'].includes(order)) {
        queryString += ` ${order.toUpperCase()}`;
    } else if (order && !['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: "Order value not accepted" })
    } else {
        queryString += ` DESC`;
    }

    return db.query(queryString)
        .then((articles) => {
            if (articles.rows.length === 0) {
                return Promise.reject({
                    status: 200,
                    msg: 'No article found'
                });
            };
            return articles.rows;
        });
};
