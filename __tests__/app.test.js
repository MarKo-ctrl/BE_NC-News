const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const connection = require('../db/connection');
const request = require('supertest');
const app = require("../app")

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

describe('GET: /api/article/:article_id', () => {
    it(`200: returns an article object with properties of 
            article_id, title, topic, author, body, created_at and votes`, () => {
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
                        created_at: "2020-08-03T13:14:00.000Z",
                        votes: 0
                    }));
            });
    });

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
                        created_at: "2020-08-03T13:14:00.000Z",
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
                        created_at: '2020-11-03T09:12:00.000Z',
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

    it(`400: returns an error message of 'Invalid request - requested update is not a number'
            when passed an empty object`, () => {
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
        return request(app)
            .get('/api/article/cloud/rain')
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

describe('GET /api/articles', () => {
    it(`200: returns an array of article objects. Each object should have the following properties:
    article_id, title, topic, author, body, created_at, votes and comment_count`, () => {
        return request(app)
            .get(`/api/articles/`)
            .expect(200)
            .then(({ body }) => {
                // console.log(body)
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
