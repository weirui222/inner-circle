'use strict';
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    isPublic: DataTypes.BOOLEAN,
    url: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.post.belongsTo(models.user);
      }
    }
  });
  return post;
};
