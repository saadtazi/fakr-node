var express = require('express'),
    supertest = require('supertest'),
    chai = require('chai'),
    expect = chai.expect;



var app1 = express();
app1.get('/1', function(req, res) { res.send('1'); });

var app2 = express();
app2.get('/2', function(req, res) { res.send('2'); });

supertest(app1)
  .get('/1')
  .end(function(err, res) {
    expect(res.text).to.eql('1');
  });

app1.get('/11', function(req, res) { res.send('11'); });

supertest(app2)
  .get('/11')
  .end(function(err, res) {
    console.log('res::', res.status, res.text);
    expect(res.status).to.eql(404);
  });


