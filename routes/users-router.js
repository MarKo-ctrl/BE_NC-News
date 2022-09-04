const usersRouter = require('express').Router();
const {
  getUsers,
  getUsername,
  checkUsername,
  regUser
} = require('../controllers/users.controllers');

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUsername);
usersRouter.post('/signin', );
usersRouter.post('/signup', checkUsername, regUser);

module.exports = usersRouter;