const {
  selectUsers,
  selectUsername,
  createUser
} = require('../models/users.models');
const bcryptjs = require('bcryptjs');

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
      if (userData.length !== 0) {
        res.status(200).send(userData)
      } else {
        return Promise.reject({
          status: 404,
          msg: 'User not found'
        });
      };
    })
    .catch(next)
};

exports.checkUsername = (req, res, next) => {
  selectUsername(req.body.username)
    .then((user) => {
      if (user.length !== 0) {
        res.status(400).send({ msg: 'Username already in use' })
      } else {
        next()
      }
    })
    .catch(next)
};

exports.checkPswd = (req, res, next) => {
  selectUsername(req.body.username)
    .then((user) => {
      if (user.length === 0) {
        res.status(404).send({ msg: 'User not found' })
      } else {
        bcryptjs.compare(req.body.password, user[0].password)
          .then((ans) => {
            if (!ans) {
              res.status(400).send({ msg: 'Wrong password' })
            } else {
              res.status(200).send(user)
            }
          })
      }
    })
    .catch(next)
}

exports.regUser = (req, res, next) => {
  const { username, name, avatarl_url } = req.body;
  bcryptjs.hash(req.body.password, 10)
    .then((hashed) => {
      createUser(username, hashed, name, avatarl_url)
        .then((user) => res.status(200).send(user))
        .catch(next);
    });
};