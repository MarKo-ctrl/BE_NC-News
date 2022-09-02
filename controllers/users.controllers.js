const {
  selectUsers,
  selectUsername,
  createUser
} = require('../models/users.models');
const bcryptjs = require('bcryptjs')

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next)
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsername(username)
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch(next)
};

exports.regUser = (req, res, next) => {
  const { username, name, avatarl_url } = req.body;
  bcryptjs.hash(req.body.password, 10)
    .then((hashed) => {
      createUser(username, hashed, name, avatarl_url)
        .then((user) => res.status(200).send(user))
        .catch(next);
    });
};