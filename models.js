const db = require('./db/connection');



exports.getTopicModel = () => {
    return db.query('SELECT * FROM topics;')
        .then( (topics) => {
            return topics.rows;
        })
}

exports.getArticleModel = (query) => {
    const queryValues = [];
    const {topic, limit, order} = query

    let SQL = 'SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC ';

    if (limit) {
        queryValues.push(limit)
        SQL += 'LIMIT $1 ';
    }

    if (queryValues.includes(limit) && topic) {
        queryValues.push(topic)
        SQL += `WHERE topic = $${queryValues.length}`;
    }

    console.log(SQL)
    return db.query(SQL, queryValues)
    .then( (articles) => {
        return articles.rows;
    })
};

exports.getArticleByIdModel = (article_id) => {    
    return db.query('SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;', [article_id])
    .then((article) => {
        if (article.rows.length !== 0) {
            return article.rows[0];
        } else {
            return Promise.reject({status: 404, msg : 'Not Found'});
        }
    })
}

exports.getCommentsByIdModel = (article_id) => {
    return Promise.all([
        db.query('SELECT * FROM articles WHERE article_id = $1 ;', [article_id])
            .then((article) => {
            if (article.rows.length !== 0) {
                return article.rows[0];
            } else {
                return Promise.reject({status: 404, msg : 'Not Found'});
            }
        }),
        db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
        .then((comments) => {
                return comments.rows;
        })
    ])
    .then( (comments) => {
        return comments[1];
    })
    .catch( (err) => {
        return Promise.reject(err);
    })
}

exports.postNewUser = (newUser) => {
    if (newUser.name && newUser.username && newUser.avatar_url) {
        const {name, username, avatar_url} = newUser;

        return db.query("INSERT INTO users (name, username, avatar_url) VALUES ($1, $2, $3) RETURNING *;", [name, username, avatar_url])
        .then( (user) => {
            return user.rows[0];
        })
        .catch( (err) => {
            return Promise.reject(err);
        })
    } else if (newUser.name && newUser.username && !newUser.avatar_url) {
        const {name, username} = newUser;

        return db.query("INSERT INTO users (name, username) VALUES ($1, $2) RETURNING *;", [name, username])
        .then( (user) => {
            return user.rows[0];
        })
        .catch( (err) => {
            return Promise.reject(err);
        })
    } else {
        return Promise.reject({status :400, msg : "Bad Request"});
    }
}

exports.postCommentByIdModels = (article_id, newComment) => {

    if (newComment.username && newComment.body) {
        const {username, body} = newComment;
            
        return db.query('INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;', [body, username, article_id])
        .then( (comment) => {
            return comment.rows[0].body; 
        })
        .catch((err) => {
            return Promise.reject(err);
        })
    } else {
        return Promise.reject({status :400, msg : "Bad Request"});
    }
}

exports.patchVoteByIdModels = (article_id, incVotes) => {

    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [incVotes.inc_votes, article_id])
    .then( (updatedArticle) => {
        if (updatedArticle.rows.length > 0) {
            return updatedArticle.rows[0];
        } else {
            return Promise.reject({status : 404, msg : 'Not Found'})
        }
    })
    .catch( (err) => {
        return Promise.reject(err)
    })

}

exports.getUsersModel = () => {

    return db.query('SELECT * FROM users;')
    .then( (users) => {
        return users.rows;
    })
}

exports.getAllArticlesIdModel = () => {
    return db.query('SELECT article_id FROM articles ORDER BY created_at;')
    .then( (article_id) => {
        return article_id.rows;
    })
}

