const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index');
const testData = {topicData, userData, articleData, commentData}
const { app } = require("../app");

afterAll(() => db.end());
beforeEach( () => seed(testData));

describe('1. GET api topics', () => {
    describe('a. status 200 & Data', () => {
        it('returns 200 status code & an array back to the user', () => {
            return request(app)
                .get('/api/topic')
                .expect(200)
                .then( (res) => {
                    const topics = res.body;
                    expect(topics).toBeInstanceOf(Array);
                    expect(topics.length).toBe(3);
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

describe('2. GET api articles', () => {
    describe('a. status 200 & Data', () => {
        it('returns 200 status code & an array back to the user', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then( (res) => {
                    const articles = res.body;
                    expect(articles).toBeInstanceOf(Array);
                    expect(articles.length).toBe(12);
                    articles.forEach(article => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                article_id : expect.any(Number),
                                title : expect.any(String),
                                topic : expect.any(String),
                                author : expect.any(String),
                                body : expect.any(String),
                                created_at : expect.any(String),
                                votes : expect.any(Number)
                            })
                        )
                    })
                })
        })
    })   
    
    describe('b. error handling', () => {
        it('send a 404 status code when user inputs a bad path', () => {
            return request(app)
                .get('/api/artikle')
                .expect(404)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Path not found')
                })
        })
    })
})