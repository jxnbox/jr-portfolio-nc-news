const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index');
const { app } = require("../app");

afterAll(() => db.end());
beforeEach( () => seed({topicData, userData, articleData, commentData}));

describe('1. GET api topics', () => {
    describe('a. status 200 & Data', () => {
        it('sends a 200 request back to the user', () => {
            return request(app)
                .get('/api/topic')
                .expect(200)
        })
        it('returns an array back to the user', () => {
            return request(app)
                .get('/api/topic')
                .expect(200)
                .then( (res) => {
                    const topics = res.body;
                    expect(topics).toBeInstanceOf(Array);
                    topics.forEach(topic => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                slug : expect.any(String),
                                description : expect.any(String)
                            })
                        )
                    })
                })
        })
    })

    describe('b. error handling', () => {
        it('send a 404 status code when user inputs a bad path', () => {
            return request(app)
                .get('/api/tpipc')
                .expect(404)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Path not found')
                })
        })
    })
})