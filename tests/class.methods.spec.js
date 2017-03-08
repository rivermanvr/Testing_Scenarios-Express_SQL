var expect = require('chai').expect;
var Sequelize = require('sequelize');

var db = new Sequelize('postgres://localhost/test_db');

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    defaultValue: 'PROF'
  }
}, {
  classMethods: {
    findProfs: function(){
      return this.findAll({ where: { name: 'PROF' }});
    
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


  describe('get profs', function(){
    beforeEach(function(){
      return Promise.all([
          User.create({}),
          User.create({})
      ]);
    
    });
    it('can return the profs', function(done){
      User.findProfs()
        .then(function(users){
          expect(users.length).to.equal(2);
          done();
        });
    });
  
  });

});
