'use strict';
module.exports = function(sequelize, DataTypes) {
  var postsUsers = sequelize.define('postsUsers', {
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return postsUsers;
};