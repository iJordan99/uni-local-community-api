'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tomTom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tomTom.init({
    streetName: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    countrySecondarySubdivision: DataTypes.STRING,
    municipality: DataTypes.STRING,
    country: DataTypes.STRING,
    street: DataTypes.STRING,
    longitude: DataTypes.DECIMAL(11, 5),
    latitude: DataTypes.DECIMAL(11, 5),
  }, {
    sequelize,
    modelName: 'tomTom',
  });
  return tomTom;
};