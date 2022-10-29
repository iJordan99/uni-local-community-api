'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User);
      models.User.belongsTo(Role);
    }
  }
  Role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false
  });
  return Role;
};