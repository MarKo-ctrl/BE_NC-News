const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  return db.query(`SELECT articles.article_id,
                      articles.title,
                      articles.topic,
                      articles.author,
                      articles.body,
                      articles.created_at,
                      articles.votes,                
                      count(comments.body) AS comment_count
                    FROM 
                      articles
                    JOIN 
                      comments
                    ON
                      articles.article_id = comments.article_id
                    WHERE 
                      articles.article_id = $1
                    GROUP BY 
                      articles.article_id`,
    [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article not found'
        });
      };
      return article.rows
    })
};

exports.updateArticleByID = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: 'Invalid request' });
  } else if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: 'Invalid request - requested update is not a number' });
  } else {
    return db.query(`UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;`,
      [article_id, inc_votes])
      .then((article) => {
        if (article.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Article not found'
          });
        };
        return article.rows[0];
      });
  };
};

exports.fetchArticles = (sortBy, order, topic, page) => {
  const fetchColumns = () => {
    return db.query(`SELECT table_name, column_name
                    FROM information_schema.columns
                    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
                      AND table_name = 'articles' OR table_name = 'comments'
                    ORDER BY table_schema, table_name;`
    )
      .then((colsNames) => {
        return colsNames.rows.map(c => c.column_name)
      })
  }

  const fetchTopics = () => {
    return db.query(`SELECT slug FROM topics;`)
      .then((topics) => {
        return topics.rows.map(t => t.slug)
      })
  }

  Promise.all([fetchColumns(), fetchTopics()]).then(([columns, topics]) => {
    [validCols, validTopics] = [columns, topics]
  })

  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,                
count(comments.body)::INTEGER AS comment_count
FROM articles
JOIN comments
ON articles.article_id = comments.article_id`;

  if (topic && validTopics.includes(topic)) {
    queryString += `\nWHERE topic='${topic}'`;
  } else if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "Requested topic does not exist" })
  };

  queryString += `\nGROUP BY articles.article_id`;

  if (!sortBy) {
    queryString += `\nORDER BY created_at`;
  } else if (sortBy && validCols.includes(sortBy)) {
    queryString += `\nORDER BY ${sortBy}`;
  } else {
    return Promise.reject({ status: 400, msg: "Sort by column not found" })
  }

  if (order && ['asc', 'desc'].includes(order)) {
    queryString += ` ${order.toUpperCase()}`;
  } else if (order && !['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: "Order value not accepted" })
  } else {
    queryString += ` DESC`;
  }

  if (page) {
    queryString += `\nLIMIT 9 OFFSET ${(page - 1) * 10}`
  }

  return db.query(queryString)
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: 'No article found'
        });
      };
      return articles.rows;
    });
};
