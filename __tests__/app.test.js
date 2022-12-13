const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index');
const testData = {topicData, userData, articleData, commentData}
const { app } = require("../app");

afterAll(() => db.end());
beforeEach( () => seed(testData));

describe('1. GET api/topics', () => {
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

describe('2. GET api/articles', () => {
    describe('a. status 200 & Data', () => {
        it('returns 200 status code & an array back to the user where the data is in descending order by created_at and a comment count', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then( (res) => {
                    const {articles} = res.body;
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
                                votes : expect.any(Number),
                                comment_count : expect.any(String)
                            })
                        )
                    })
                    expect(articles).toBeSortedBy('created_at', {descending : true});
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

describe('3. Get api/articles/:article_id', () => {
    describe('a. status 200 & data', () => {
        it('returns 200 status code & the article data object with the corresponding article_id back to the user', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then( (res) => {
                const {article} = res.body;
                expect(article).toBeInstanceOf(Array);
                expect(article.length).toBe(1);
                expect(article[0]).toEqual(
                    expect.objectContaining({
                        article_id : expect.any(Number),
                        title : expect.any(String),
                        topic : expect.any(String),
                        author : expect.any(String),
                        body : expect.any(String),
                        created_at : expect.any(String),
                        votes : expect.any(Number),
                    })
                )

            })
        })
    })

    describe('b. error handling', () => {
        it('send a 400 status code when a user inputs a bad request', () => {
            return request(app)
                .get('/api/articles/article3')
                .expect(400)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Bad Request')
                })
        })

        it('send a 404 status code when user inputs a bad path', () => {
            return request(app)
                .get('/api/artiales/3')
                .expect(404)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Path not found')
                })
        })
    })
})