'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    static associate(models) {
      // define association here
      Issue.belongsTo(models.User);
      models.User.hasMany(Issue);
    }
  }
  Issue.init({
    issueName: DataTypes.STRING(30), 
    location: DataTypes.STRING(100),
    photo: DataTypes.STRING,
    status: DataTypes.STRING(10),
    description: DataTypes.TEXT,
    userID: DataTypes.INTEGER,
    reportedBy: DataTypes.STRING(25),
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};