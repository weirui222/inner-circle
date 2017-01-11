var expect = require('chai').expect;
var db = require('../models');

describe('User Friends', function() {
  it('should be able to look up existing users', function(done) {
    db.user.find({where: {email: 'a@live.com'}}).then(function(user1) {
      db.user.find({where: {email: 'congcongli@live.com'}}).then(function(user2) {
        expect(user1.id).to.equal(1);
        done();
      });
    });
  });

  it('should be able to add friends', function(done) {
    db.user.find({where: {email: 'a@live.com'}}).then(function(user1) {
      db.user.find({where: {email: 'congcongli@live.com'}}).then(function(user2) {
        user1.addFriend(user2).then(function(friend) {
          user1.getFriends().then(function(friends) {
            expect(friends.length).to.equal(1);
            done();
          });
        });
      });
    });
  });
  it('should be able to add friends', function(done) {
    db.user.find({where: {email: 'a@live.com'}}).then(function(user1) {
      db.user.find({where: {email: 'congcongli@live.com'}}).then(function(user2) {
        user2.addFriend(user1).then(function(friend) {
          user2.getFriends().then(function(friends) {
            expect(friends.length).to.equal(3);
            done();
          });
        });
      });
    });
  });
});
