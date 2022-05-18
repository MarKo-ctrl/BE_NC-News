const db = require('../db/connection');

exports.selectUsers = () => {
    return db.query("SELECT username FROM users")
        .then((users) => {
            return users.rows;
        });
};