const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const { app } = require("../app");

afterAll(() => db.end());
beforeEach( () => seed(testData));