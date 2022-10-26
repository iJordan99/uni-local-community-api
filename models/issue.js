'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
    description: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    owner: DataTypes.STRING(25),
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};