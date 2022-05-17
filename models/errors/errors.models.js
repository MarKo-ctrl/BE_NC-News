exports.handleCustomServerErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    };
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send('Server Error');
};

exports.handlePSQLError = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' });
    } else {
        res.status(500).send('Server Error');
    };
};