const {
    fetchTopics
} = require('../models/models');


exports.getTopics = (req, res, next) => {
    console.log(req);
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
};