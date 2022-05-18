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
    it ('200: returns an article object with the votes property updated by the passed value', () => {
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
});