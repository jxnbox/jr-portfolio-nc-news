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
                    expect(msg).toBe('Not Found')
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
})

describe('3. GET api/articles/:article_id', () => {
    describe('a. status 200 & data', () => {
        it('returns 200 status code & the article data object with the corresponding article_id back to the user', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then( (res) => {
                const {article} = res.body;
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id : 3,
                        title : 'Eight pug gifs that remind me of mitch',
                        topic : 'mitch',
                        author : 'icellusedkars',
                        body : 'some gifs',
                        created_at : '2020-11-03T09:12:00.000Z',
                        votes : 0,
                    })
                )
                
            })
        })
    })

    describe('b. error handling', () => {
        it('send a 400 status code when user inputs a bad request', () => {
            return request(app)
                .get('/api/articles/article3')
                .expect(400)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Bad Request')
                })
        })

        it('send a 404 status code when user inputs a valid id but data does not exist', () => {
            return request(app)
                .get('/api/articles/99999')
                .expect(404)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Not Found')
                })
        })
    })
})

describe('4. GET /api/articles/:article_id/comments', () => {
    describe('a. status 200 & data', () => {
        it('returns 200 status code & an array back to the user where the data starts with the latest comment', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then((res) => {
                const articles = res.body;
                expect(articles).toBeInstanceOf(Array);
                expect(articles.length).toBe(2);
                articles.forEach(article => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id : 3,
                            author : expect.any(String),
                            body : expect.any(String),
                            created_at : expect.any(String),
                            votes : expect.any(Number)
                        })
                    )
                })
                expect(articles).toBeSortedBy('created_at',{ descending: true })
            })
        })

        it('returns 200 status code & empty array when a valid ID is passed but contains no comments', () => {
            return request(app)
                   .get('/api/articles/7/comments')    
                   .expect(200)
                   .then( (res) => {
                        const comments = res.body;
                        expect(comments).toEqual([])
                   })
        })
    })

    describe('b. error handling', () => {

        it('send a 400 status code when user inputs the wrong datatype for the ID', () => {
            return request(app)
                .get('/api/articles/article3/comments')
                .expect(400)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Bad Request')
                })
        })

        it('send a 404 status code when user inputs a valid ID datatype but ID is not in the data', () => {
            return request(app)
                .get('/api/articles/999/comments')
                .expect(404)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Not Found')
                })
        })
    })
})

describe('5. POST /api/articles/:article_id/comments', () => {
    describe('a. status 201 & data', () => {
        it('returns 201 status code and the object of the comment back to the user', () => {
            const newCommentOnj = { name: "jan", username: "jxnbox", body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/7/comments')
            .send(newCommentOnj)
            .expect(201)
            .then( (res) => {
                const {comment} = res.body;
                expect(comment).toEqual("amazing! 10/10");
            })
        })

    })

    describe('b. error handling', () => {
        it('return 400 status code when the wrong datatype is given for the ID', () => {
            const newCommentOnj = { name: "jan", username: "jxnbox", body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/article7/comments')
            .send(newCommentOnj)
            .expect(400)
        })

        it('return 404 status code when a valid ID datatype is given but ID does not exist', () => {
            const newCommentOnj = { name: "jan", username: "jxnbox", body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/999/comments')
            .send(newCommentOnj)
            .expect(404)
        })
    })
})