const db = require('../db/connection');

exports.selectUsers = () => {
    return db.query("SELECT username FROM users")
        .then((users) => {
            return users.rows;
        });
};

exports.selectUsername = (username) => {
    return db.query(`SELECT * FROM users
    WHERE username = $1`, [username])
        .then((users) => {
            if (users.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'User not found'
                });
            };
            return users.rows;
        });
};