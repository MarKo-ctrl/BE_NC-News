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

const corsOptions = {origin: 'http://localhost:3000/login'}
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRouter)

app.all('/*', handleInvalidRoutes);
app.use(handleCustomServerErrors);
app.use(handlePSQLError);
app.use(handleServerErrors);

module.exports = app;
