var expect = require('chai').expect;
var Sequelize = require('sequelize');

var db = new Sequelize('postgres://localhost/test_db');

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    validate: {
      isNotProf: function(val){
        if(val === 'PROF')
          throw new Error('You can not name your user PROF');
      }
    }
  }
});

describe.only('User', function(){
  beforeEach(function(done){
    db.sync({ force: true })
      .then(function(){
        done();
      });
  });

  describe('a user who is named PROF', function(){
    it('can NOT be created', function(done){
      User.create({ name: 'PROF'})
        .catch(function(err){
          expect(err.errors[0].path).to.equal('name');
          done(); 
        });;
    });
  });

  describe('a user who is not named PROF', function(){
    it('can be created', function(done){
      User.create({ name: 'foo'})
        .then(function(user){
          expect(user).to.be.ok;
          done();
        })
        .catch(done);
    });
  });
});
