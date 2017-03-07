var expect = require('chai').expect;
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost/test_db');
var User = db.define('user', {
  name: Sequelize.STRING,
  buzz: Sequelize.STRING
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
  },
  hooks: {
    beforeCreate: function(user, options){
      user.bar = 'buzz';
    },
    beforeUpdate: function(user, options){
      user.bar = 'BUZZ';
    }
  }
});

describe('User', function(){
  beforeEach(function(done){
    db.sync({force: true })
      .then(function(){ done(); })
      .catch(done);
  });

  describe('hooks', function(){
    it('before create works', function(done){
      var user = User.build({ name: 'foo' });
      user.save()
        .then(function(user){
          expect(user.bar).to.equal('buzz');
          done();
        })
        .catch(done);
    });
    it('before update works', function(done){
      var user = User.build({ name: 'foo' });
      user.save()
        .then(function(user){
          user.bar = 'fizz';
          return user.save();
        })
        .then(function(user){
          expect(user.bar).to.equal('BUZZ');
          done();
        })
        .catch(done);
    });
  });
});
