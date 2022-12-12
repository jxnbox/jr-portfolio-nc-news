const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testTopicData = require('../db/data/test-data/topics');
const { app } = require("../app");

afterAll(() => db.end());
beforeEach( () => seed(testTopicData));