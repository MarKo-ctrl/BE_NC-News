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
    // console.log(err)
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' });
    } else if (err.code === '23503' && /author/g.test(err.detail)) {
        res.status(404).send({ msg: 'User not found' });
    } else if (err.code === '23503' && /article/g.test(err.detail)) {
        res.status(404).send({ msg: 'Article not found' });
    } else {
        res.status(500).send('Server Error');
    };
};