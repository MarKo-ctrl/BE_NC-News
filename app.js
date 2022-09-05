const express = require('express');
const cors = require('cors');
const { handleInvalidRoutes } = require('./controllers/errors/errors.controllers');
const {
  handleCustomServerErrors,
  handleServerErrors,
  handlePSQLError
} = require('./models/errors/errors.models');
const apiRouter = require('./routes/api-router')

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:3000/login',
  credentials: true
}));
app.use(express.json());

app.use('/api', apiRouter)

app.all('/*', handleInvalidRoutes);
app.use(handleCustomServerErrors);
app.use(handlePSQLError);
app.use(handleServerErrors);

module.exports = app;
