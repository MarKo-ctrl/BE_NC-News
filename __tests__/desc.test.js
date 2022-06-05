const request = require('supertest');
const app = require("../app");
const endpoints = require("../endpoints.json");

describe('GET /api', () => {
    it('200: responds with an object describing all available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toBeInstanceOf(Object)
                expect(Object.keys(body)).toHaveLength(9)
                expect(body).toEqual(
                    expect.objectContaining({
                        'GET /api': expect.any(Object),
                        'GET /api/topics': expect.any(Object),
                        'GET /api/articles': expect.any(Object),
                        'GET /api/articles/:article_id': expect.any(Object),
                        'PATCH /api/articles/:article_id': expect.any(Object),
                        'GET /api/users': expect.any(Object),
                        'GET /api/articles/:article_id/comments': expect.any(Object),
                        'POST /api/articles/:article_id/comments': expect.any(Object),
                        'DELETE /api/comments/:comment_id': expect.any(Object),
                    }))
            })
    });
});