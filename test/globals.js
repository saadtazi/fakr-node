var chai = require('chai');

global.expect = chai.expect;
global.fakr = require('../lib/index');
global.supertest = require('supertest');
global.request = require('request');
global._ = require('lodash');
