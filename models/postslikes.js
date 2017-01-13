'use strict';
module.exports = function(sequelize, DataTypes) {
  var postsLikes = sequelize.define('postsLikes', {
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return postsLikes;
};