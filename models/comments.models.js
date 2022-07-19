const db = require('../db/connection');

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
    return db.query(`INSERT INTO comments (author, body, article_id)
                    VALUES ($1, $2, $3)
                    RETURNING *;`, [username, body, articleID])
        .then((comment) => {
            return comment.rows[0];
        })
};

exports.purgeComment = (commentID) => {
    const { comment_id } = commentID;
    if (!comment_id) {
        return Promise.reject({ status: 400, msg: 'No comment ID requested' });
    } else if (typeof comment_id !== 'string') {
        return Promise.reject({ status: 400, msg: 'Invalid ID' });
    } else {
        return db.query(`DELETE FROM comments
                    WHERE comment_id=$1
                    RETURNING comment_id`, [comment_id])
            .then((deletedComment) => {
                if (!deletedComment.rows.length) {
                    return Promise.reject({
                        status: 404,
                        msg: 'Comment does not exist'
                    });
                }
            })
    }
}