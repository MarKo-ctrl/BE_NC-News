const {
    selectUsers,
    selectUsername,
} = require('../models/users.models');

exports.getUsers = (req, res, next) => {
    selectUsers()
        .then((users) => {
            res.status(200).send(users);
        })
        .catch(next)
};

exports.getUsername = (req, res, next) => {
    const {username} = req.params;
    selectUsername(username)
        .then((userData) => {
            res.status(200).send(userData);
        })
        .catch(next)
};