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
    if ('username' in newComment && 'body' in newComment) {
        const { username, body } = newComment
        return db.query(`INSERT INTO comments (author, body, article_id)
                        VALUES ($1, $2, $3)
                        RETURNING *;`, [username, body, articleID])
            .then((comment) => {
                return comment.rows[0];
            })
    } else {
        return Promise.reject({ status: 400, msg: 'Missing required properties' });
    };
    
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
                };
            });
    };
};

exports.updateCommentVote = (comment_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({ status: 400, msg: 'Invalid request' });
    } else if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: 'Invalid request - requested update is not a number' });
    } else {
        return db.query(`UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`,
            [inc_votes, comment_id])
            .then((comment) => {
                if (comment.rows.length === 0) {
                    return Promise.reject({
                        status: 404,
                        msg: 'Comment not found'
                    });
                };
                return comment.rows[0];
            });
    };
};