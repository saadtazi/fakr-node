var chai = require('chai');

global.expect = chai.expect;
global.fakr = require('../index');
global.supertest = require('supertest');
