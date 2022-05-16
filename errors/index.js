exports.handleCustomErrors = (req, res, next) => {
    res.status(404).send({ msg: 'Route not found' })
};