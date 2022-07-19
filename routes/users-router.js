const usersRouter = require('express').Router();
const {
    getUsers,
    getUsername,
} = require('../controllers/users.controllers');


 usersRouter.get('/', getUsers);
 usersRouter.get('/:username', getUsername);

 module.exports = usersRouter;