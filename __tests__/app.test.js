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

describe('5. POST /api/users', () => {
    describe('a. status 201 & data', () => {
        ('returns 201 status code and the object of the new user back to the user', () => {
            
            const newUser = {name: "jan", username: "jxnbox", avatar_url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp/220px-Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp.png"}

            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .then( (res) => {
                const {user} = res.body;
                expect(user).toEqual(newUser);
            })
           
        })
        it('when given a object with no avatar url returns 201 status code and the object of the new user back to the user', () => {
            
            const newUser = {name: "jan", username: "jxnbox"}

            result = {name: "jan", username: "jxnbox", avatar_url: null}
            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .then( (res) => {
                const {user} = res.body;
                expect(user).toEqual(result);
            })
           
        })

    })

    describe('b. error handling', () => {
        it('return 400 status code when no name is given', () => {
            const newUser = {username: "jxnbox"}
            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            
        })

        it('return 400 status code when no username is given', () => {
            const newUser = {name: 'jan'}
            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            
        })
    })
})

describe('6. POST /api/articles/:article_id/comments', () => {
    describe('a. status 201 & data', () => {
        it('returns 201 status code and the object of the comment back to the user', () => {

            const newCommentOnj = {username: 'icellusedkars', body: "amazing! 10/10"}

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
            const newCommentOnj = {username: 'icellusedkars', body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/article7/comments')
            .send(newCommentOnj)
            .expect(400)
            .then( (res) => {
                const {msg} = res.body
                expect(msg).toBe("Bad Request")
            })
        })

        it('return 404 status code when a valid ID datatype is given but ID does not exist', () => {

            const newCommentOnj = {username: 'icellusedkars', body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/999/comments')
            .send(newCommentOnj)
            .expect(404)
            .then( (res) => {
                const {msg} = res.body
                expect(msg).toBe('Not Found')
            })

        })

        it('return 404 status code when a valid ID datatype is given but user does not exist', () => {

            const newCommentOnj = {username: 'jxnbox', body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/7/comments')
            .send(newCommentOnj)
            .expect(404)
            .then( (res) => {
                const {msg} = res.body
                expect(msg).toBe('Not Found')
            })

        })

        it('return 400 status code when a valid ID datatype is given but the Object does not contain a username', () => {
            const newCommentOnj = { body: "amazing! 10/10"}

            return request(app)
            .post('/api/articles/7/comments')
            .send(newCommentOnj)
            .expect(400)
            .then( (res) => {
                const {msg} = res.body
                expect(msg).toBe('Bad Request')
            })

        })
    })
})

describe('7. PATCH /api/articles/:article_id', () => {
    describe('a. status 200 & data', () => {
        it('returns 200 status code & the article with the updated vote', () => {
            const inc_votes = {inc_votes : 5}

            const result = {
                article_id: 11,
                title: "Am I a cat?",
                topic: "mitch",
                author: "icellusedkars",
                body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
                created_at: "2020-01-15T22:21:00.000Z",
                votes: 5,
              }

            return request(app)
            .patch('/api/articles/11')
            .send(inc_votes)
            .expect(202)
            .then ( (res) => {
                const {article} = res.body;
                expect(article).toMatchObject(result)
            })
        })
    })

    describe('b. error handling', () => {
        it('returns 404 status code when a valid id datatype is passed but id does not exist', () => {
            const inc_votes = {inc_votes : 1}
    
            return request(app)
                .patch('/api/articles/1111111')
                .send(inc_votes)
                .expect(404)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Not Found')
                })
        })

        it('returns 400 status code when a invalid id datatype is passed', () => {
            const inc_votes = {inc_votes : 1}
    
            return request(app)
                .patch('/api/articles/article11')
                .send(inc_votes)
                .expect(400)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Bad Request')
                })
        })

        it('returns 400 status code when the object passed contains the wrong datatype', () => {
            const inc_votes = {inc_votes : "hello"}
    
            return request(app)
                .patch('/api/articles/7')
                .send(inc_votes)
                .expect(400)
                .then ((res) => {
                    const {msg} = res.body;
                    expect(msg).toBe('Bad Request')
                })
        })
    })
})

describe('8. GET /api/users', () => {
    describe('a. status 200 & data', () => {
        it('return a status code of 200 and an array of objects that contains all the users', () => {

            return request(app)
            .get('/api/users')
            .expect(200)
            .then( (res) => {
                const usersArr = res.body;
                expect(usersArr).toBeInstanceOf(Array);
                usersArr.forEach(user => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String, null)
                        })
                    )
                })
            })
        })
    })
}) 

describe.only('9. GET /api/articles (queries)', () => {
    describe('200 status & get data', () => {
        it('return articles that matches the query provied from a user', () => {

            return request(app)
            .get('/api/articles?limit=5')
            .expect(200)
            .then( (res) => {
                const {articles} = res.body;
                console.log(articles)
                expect(articles.length).toBe(5)
            })
        })
    })
})