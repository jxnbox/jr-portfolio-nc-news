const db = require('./db/connection')

exports.getTopicModel = () => {
    return db.query('SELECT * FROM topics;')
        .then( (topics) => {
            return topics.rows
        })
}