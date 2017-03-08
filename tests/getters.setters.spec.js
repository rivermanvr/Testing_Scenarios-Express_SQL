var expect = require('chai').expect;
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost/test_db');
var User = db.define('user', {
  name: Sequelize.STRING
}, {
  setterMethods: {
    name: function(val){
      this.setDataValue('name', val + '!');
    }
  },
  getterMethods: {
    fullName: function(){
      return this.name + ' ' + this.name;
    },
    name: function(){
      return this.getDataValue('name').toUpperCase(); 
    }
  }
});

describe('User', function(){
  beforeEach(function(done){
    db.sync({force: true })
      .then(function(){ done() })
      .catch(done);
  
  });
  it('can be created', function(done){
    User.create({ name: 'prof' })
      .then(function(user){
        expect(user.name).to.equal('PROF!');
        expect(user.fullName).to.equal('PROF! PROF!');
        done();
      })
      .catch(done);
  })
});
