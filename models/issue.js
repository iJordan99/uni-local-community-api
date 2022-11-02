'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class issue extends Model {
    static associate(models) {
      // define association here
      issue.belongsTo(models.user);
      models.user.hasMany(issue);
    }
  }
  issue.init({
    issueName: DataTypes.STRING(30), 
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    location: DataTypes.STRING(100),
    photo: DataTypes.STRING,
    status: DataTypes.STRING(10),
    description: DataTypes.TEXT,
    userID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'issue',
  });
  return issue;
};