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


exports.createUser = (username, password, name, avatar_url = '') => {
  this.selectUsers()
    .then((users) => {
      for (let i in users) {
        if (users[i].username === username) {
          return Promise.reject({
            status: 400,
            msg: 'Username already in use'
          })
        }
      }
    });

  return db.query(`INSERT INTO users (username, password, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *;`, [username, password, name, avatar_url])
    .then((user) => {
      return user.rows;
    })
};