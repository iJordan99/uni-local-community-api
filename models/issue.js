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
    issueName: DataTypes.STRING, 
    location: DataTypes.STRING,
    photo: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};