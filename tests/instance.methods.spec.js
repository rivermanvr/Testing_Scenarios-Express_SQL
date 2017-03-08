var expect = require('chai').expect;
var Sequelize = require('sequelize');

var db = new Sequelize('postgres://localhost/test_db');

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    defaultValue: 'PROF'
  }
}, {
  instanceMethods: {
    findSimilar: function(){
      return User.findAll({ 
        where: {
          name: { $like: '%' + this.name + '%' },
          id: { $ne: this.id }
        }
      });
    }
  },
  hooks: {
  }
});

describe.only('User', function(){
  beforeEach(function(done){
    db.sync({ force: true })
      .then(function(){
        done();
      });
  });


  describe('find similar', function(){
    beforeEach(function(){
      return Promise.all([
          User.create({ name: 'PROF'}),
          User.create({ name: 'PROFESSOR' }),
          User.create({ name: 'FIZZ' })
      ]);
    
    });
    it('finds similar users based on name', function(done){
      User.findOne({ where: { name: 'PROF' } })
        .then(function(prof){
          expect(prof).to.be.ok;
          return prof.findSimilar();
        })
        .then(function(similar){
          expect(similar.length).to.equal(1);
          expect(similar[0].name).to.equal('PROFESSOR');
          done();
        })
        .catch(done);
    });
  
  });

});
