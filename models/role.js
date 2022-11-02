'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    static associate(models) {
      role.hasMany(models.user);
      models.user.belongsTo(role);
    }
  }
  role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'role',
    timestamps: false
  });
  return role;
};