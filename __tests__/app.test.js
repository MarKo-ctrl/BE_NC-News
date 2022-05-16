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
                const { topics } = body;
                expect(topics).toBeInstanceOf(Array);
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),
                        })
                    );
                });
            });
    });

    it.only('404: responds with a not found message when the endpoint does not exist', () => {
        return request(app)
            .get('/api/dog')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Route not found');
            });
    });
});