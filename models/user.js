'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    },
    facebookId: {
      type: DataTypes.STRING
    },
    facebookToken: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, callback) {
        if (createdUser.password) {
          var hash = bcrypt.hashSync(createdUser.password, 10);
          createdUser.password = hash;
        }
        callback(null, createdUser);
      }
    },
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.post);
        models.user.belongsToMany(models.user, { as: 'friends', through: 'userFriends' });
        models.user.belongsToMany(models.post, { as: 'likes', through: 'postsLikes' });
        // models.user.belongsToMany(models.user, { through: 'userFriends' });
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function() {
        var jsonUser = this.get();

        delete jsonUser.password;
        return jsonUser;
      }
    }
  });
  return user;
};
