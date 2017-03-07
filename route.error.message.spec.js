var expect = require('chai').expect;
var app = require('express')();
var client = require('supertest')(app);

var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost/test_db');

var Foo = db.define('foo', {

});

app.get('/foos', function(req, res, next){
  Foo.findAll({ where: { fizz: 'buzz'}})
    .then(function(foos){
      res.send(foos);
    })
    .catch(function(){
      res.status(500).send({
        message: 'Bad Query'
      });
    
    });
});


describe('routes', function(){
  beforeEach(function(done){
    db.sync({force: true})
      .then(function(){
        return Foo.create({})
      })
      .then(function(){
        done();
      })
      .catch(done);
  });
  
  describe('/foos', function(){
    it('returns foos', function(done){
      client.get('/foos')
        .expect(500)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.body.message).to.equal('Bad Query');
          done();
        });
    });
  });
});
