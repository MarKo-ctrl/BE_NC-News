const { seed } = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const connection = require('../db/connection');
const request = require('supertest');
const app = require("../app")
const { convertTimestampToDate } = require('../db/helpers/utils')


beforeEach(() => seed(testData));

afterAll(() => {
  return connection.end();
})

describe('GET /api/topics', () => {
  it('200: returns a list of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  it('404: responds with a not found message when the route passed does not exist', () => {
    return request(app)
      .get('/api/dog')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('GET /api/articles', () => {
  it(`200: returns an array of article objects. Each object should have the following properties:
    article_id, title, topic, author, body, created_at, votes and comment_count`, () => {
    return request(app)
      .get(`/api/articles/`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(5);
        body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            }));
        });
      });
  });

  it('404: responds with a not found message when the route passed does not exist', () => {
    return request(app)
      .get('/api/oneMinReadArticles')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });

});

describe('GET: /api/article/:article_id', () => {
  it(`200: returns an article object with properties of 
            article_id, title, topic, author, body, created_at, votes and 
            the total amount of comments for the requested ID`, () => {
    const ARTICLE_ID = 5;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.article).toHaveLength(1);
        expect(body.article[0]).toEqual(
          expect.objectContaining({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: expect.any(String),
            votes: 0,
            comment_count: "2"
          }));
      });
  });

  it(`404: returns an error message of 'Article not found'
        when passed an ID that does not exist`, () => {
    const ARTICLE_ID = 13;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });

  it(`400: returns with an error message when passed an 
        invalid article ID`, () => {
    const ARTICLE_ID = 'AAA';
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
});

describe('PATCH: /api/articles/:article_id', () => {
  it('200: returns an article object with the votes property updated by the passed value', () => {
    const voteUpdates = { inc_votes: 2 };
    return request(app)
      .patch('/api/articles/3')
      .send(voteUpdates)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'some gifs',
            created_at: expect.any(String),
            votes: 2
          }));
      })
  });

  it(`400: returns an error message of 'Invalid request' when passed an empty object`, () => {
    const voteUpdates = {};
    return request(app)
      .patch('/api/articles/3')
      .send(voteUpdates)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request');
      });
  });

  it(`400: returns an error message of 'Invalid request - requested update is not a number'`, () => {
    const voteUpdates = { inc_votes: 'sunnyDay' };
    return request(app)
      .patch('/api/articles/3')
      .send(voteUpdates)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request - requested update is not a number');
      });
  });

  it('404: responds with a not found message when the route passed does not exist', () => {
    const voteUpdates = { inc_votes: 2 };
    return request(app)
      .get('/api/article/cloud/rain')
      .send(voteUpdates)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('GET /api/users', () => {
  it('200: returns an array of users objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(4);
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String)
            })
          );
        });
      });
  });

  it('404: responds with a not found message when the route passed does not exist', () => {
    return request(app)
      .get('/api/myWonderfulUsers')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('POST: /api/users/signup', () => {
  it('200: responds with an array of a new user', () => {
    const newUser = { username: 'pao13', password: 'hKzr9!@R', name: 'Marios' }
    return request(app)
      .post('/api/users/signup')
      .send(newUser)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(1);
        expect(body[0]).toEqual(
          expect.objectContaining({
            username: 'pao13',
            password: expect.any(String),
            name: 'Marios',
            avatar_url: ''
          })
        );
      });
  });

  it('400: responds with a message that the username exists', () => {
    const newUser = { username: 'lurker', password: 'B9s$ZnCF', name: 'do_nothing' }
    return request(app)
      .post('/api/users/signup')
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Username already in use')
      });
  });
});

describe('POST: /api/users/signin', () => {
  it('400: responds with a not found message if the user is not registered', () => {
    const user = { username: 'pao13', password: 'hKzr9!@R' }
    return request(app)
      .post('/api/users/signin')
      .send(user)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      });
  });

  it('200: responds with user info when the given user password matches the stored password', () => {
    const userToSignin = { username: 'lurker', password: 'B9s$ZnCF' }
    return request(app)
      .post('/api/users/signin')
      .send(userToSignin)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(1);
        expect(body[0]).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            password: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String)
          })
        );
      });
  });

  it('200: responds with a message when the given user password does not match the stored password', () => {
    const userToSignin = { username: 'lurker', password: 'I am wrong' }
    return request(app)
      .post('/api/users/signin')
      .send(userToSignin)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Wrong password');
      })
  });
});

describe('GET /api/users/:username', () => {
  it('200: responds with a user object containing the following properties: username, avatar_url, name', () => {
    const username = 'butter_bridge';
    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(1);
        expect(body[0]).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
        );
      });
  });

  it('404: username does not exist', () => {
    const username = '4consideration';
    return request(app)
      .get(`/api/users/${username}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  it(`200: responds with an array of comments for the given article_id. Each comment should have
    the following properties: comment_id, votes, created_at, author, body`, () => {
    return request(app)
      .get(`/api/articles/5/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.rows).toBeInstanceOf(Array);
        expect(body.rows).toHaveLength(2);
        body.rows.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
            }));
        });
      });
  });

  it('200: responds with an empty array when there are no comments for the given article', () => {
    return request(app)
      .get(`/api/articles/8/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.rows).toEqual([]);
      });
  });

  it(`404: returns an error message of article not found when passed an article ID that does not exist`, () => {
    return request(app)
      .get('/api/articles/16/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No article found');
      });
  });

  it('400: returns with an error message when passed an invalid article ID', () => {
    const ARTICLE_ID = 'VII';
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
});

describe('POST: /api/articles/:article_id/comments', () => {
  it('201: returns a new comment object', () => {
    const newComment = { username: 'lurker', body: 'This is awesome!' };
    const article_id = 4;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 4,
            author: "lurker",
            body: "This is awesome!",
            comment_id: 19,
            created_at: expect.any(String),
            votes: 0
          }));
      })
  });

  it('201: ignores unnecessary comment properties', () => {
    const newComment = { username: 'lurker', body: 'This is awesome!', number: 'five' };
    const article_id = 4;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 4,
            author: "lurker",
            body: "This is awesome!",
            comment_id: 19,
            created_at: expect.any(String),
            votes: 0
          }));
      })
  });

  it('404: returns a message <User not found> when the given username does not exist', () => {
    const newComment = { username: 'superman', body: 'This is awesome!' };
    const article_id = 4;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      })
  });

  it('400: returns with an error message when passed an invalid article ID', () => {
    const ARTICLE_ID = 'VII';
    const newComment = { username: 'lurker', body: 'This is awesome!' };
    return request(app)
      .post(`/api/articles/${ARTICLE_ID}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });

  it('400: returns with an error message when missing required properties', () => {
    const ARTICLE_ID = 4;
    const newComment = { body: 'This is awesome!' };
    return request(app)
      .post(`/api/articles/${ARTICLE_ID}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Missing required properties');
      });
  });

  it(`404: returns an error message of article not found when passed an article ID that does not exist`, () => {
    const ARTICLE_ID = 1989;
    const newComment = { username: 'lurker', body: 'This is awesome!' };
    return request(app)
      .post(`/api/articles/${ARTICLE_ID}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
});

describe('GET: /api/articles (queries)', () => {
  it('200: responds with an array of article objects sorted by date (descending) as default ', () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        const dateBody = body.map(article => convertTimestampToDate(article));
        for (let i = 0; i < (dateBody.length - 2); i++) {
          expect(dateBody[i + 1].created_at).toBeBefore(dateBody[i].created_at)
        }
      });
  });

  it('200: responds with an array of article objects with user-defined sort & order values', () => {
    return request(app)
      .get(`/api/articles/?sort_by=title&order=asc`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy('title', { ascending: true })
      });
  });

  it('200: responds with an array of article objects filtered by the given topic', () => {
    return request(app)
      .get(`/api/articles/?topic=mitch`)
      .expect(200)
      .then(({ body }) => {
        body.forEach((article => {
          expect(article.topic).toBe('mitch');
        }));
      });
  });

  it('400: responds with an error message when the given sort_by column does not exist', () => {
    return request(app)
      .get(`/api/articles/?sort_by=viewsCount`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sort by column not found")
      })
  });

  it('400: responds with an error message when given order value different form desc or asc', () => {
    return request(app)
      .get(`/api/articles/?order=minToMax`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Order value not accepted")
      })
  });

  it('404: responds with error when request is filtered by a topic that does not exist', () => {
    return request(app)
      .get(`/api/articles/?topic=rainbow`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Requested topic does not exist")
      })
  });

  it('200: valid topic query, but has no articles responds with an empty array of articles', () => {
    return request(app)
      .get(`/api/articles/?topic=paper`)
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe('No article found');
      });
  });
});

describe('DELETE: /api/comments/:comment_id', () => {
  it('204: responds with no content', () => {
    const comment_id = 2;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({})
      })
  });

  it('404: responds with an error message when passed a comment_id that does not exist', () => {
    const comment_id = 333;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment does not exist')
      })
  });

  it('400: responds with an error message when passed an invalid comment ID', () => {
    const comment_id = 'xxx';
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });

  });

  it('400: responds with an error message when no comment ID is given', () => {
    return request(app)
      .delete(`/api/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('PATCH: /api/comments/:comment_id', () => {
  it('200: returns a comment object with the votes property updated by the given value', () => {
    const voteUpdates = { inc_votes: 2 };
    return request(app)
      .patch('/api/comments/3')
      .send(voteUpdates)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            comment_id: 3,
            article_id: 1,
            author: 'icellusedkars',
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            created_at: expect.any(String),
            votes: 102
          }));
      });
  });

  it(`400: returns an error message of 'Invalid request' when passed an empty object`, () => {
    const voteUpdates = {};
    return request(app)
      .patch('/api/comments/3')
      .send(voteUpdates)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request');
      });
  });

  it(`400: returns an error message of 'Invalid request - requested update is not a number'`, () => {
    const voteUpdates = { inc_votes: 'sunnyDay' };
    return request(app)
      .patch('/api/comments/3')
      .send(voteUpdates)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request - requested update is not a number');
      });
  });

  it('404: responds with a not found message when the route passed does not exist', () => {
    const voteUpdates = { inc_votes: 2 };
    return request(app)
      .get('/api/article/cloud/rain')
      .send(voteUpdates)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});