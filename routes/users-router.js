const usersRouter = require('express').Router();
const {
  getUsers,
  getUsername,
  regUser
} = require('../controllers/users.controllers');

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUsername);
usersRouter.post('/signin');
usersRouter.post('/signup', regUser);

module.exports = usersRouter;