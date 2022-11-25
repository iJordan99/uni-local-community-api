'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tomToms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      longitude: Sequelize.DECIMAL(11, 5),
      latitude: Sequelize.DECIMAL(11, 5),
      streetName: {
        type: Sequelize.STRING
      },
      countryCode: {
        type: Sequelize.STRING
      },
      countrySecondarySubdivision: {
        type: Sequelize.STRING
      },
      municipality: {
        type: Sequelize.STRING
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tomToms');
  }
};