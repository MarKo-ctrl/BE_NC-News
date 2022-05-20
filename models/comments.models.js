const db = require('../db/connection');

exports.insertComment = (newComment, articleID) => {
    const { username, body } = newComment
    return db.query(`INSERT INTO comments (author, body, article_id)
                    VALUES ($1, $2, $3)
                    RETURNING *;`, [username, body, articleID])
        .then((comment) => {
            return comment.rows[0];
        })
};