const usersRouter = require('express').Router();
const {
  getUsers,
  getUsername,
  checkUsername,
  checkPswd,
  regUser
} = require('../controllers/users.controllers');

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUsername);
usersRouter.post('/signin', checkPswd);
usersRouter.post('/signup', checkUsername, regUser);

module.exports = usersRouter;