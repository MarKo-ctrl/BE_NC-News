const desc = require('../endpoints.json')

exports.getDesc = (req, res, next) => {
            res.status(200).send(desc)
        }