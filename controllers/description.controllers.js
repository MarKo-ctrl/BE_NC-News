const fs = require('fs/promises')

exports.getDesc = (req, res, next) => {
    return fs.readFile('/home/marko/Documents/northcoders/backend/be-nc-news/endpoints.json')
        .then((endPoints) => {
            const endpoints = JSON.parse(endPoints);
            res.status(200).send(endpoints)
        })
}