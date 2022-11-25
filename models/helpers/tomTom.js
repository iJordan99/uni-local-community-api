const { sequelize,tomTom } = require('../');
const { Op } = require("sequelize");

const createRecord = async (data) => (
  tomTom.create({
    longitude: data.position.lon,
    latitude: data.position.lat,
    streetName: data.address.streetName,
    countryCode: data.address.countryCode,
    countrySecondarySubdivision: data.address.countrySecondarySubdivision,
    municipality: data.address.municipality,
    postalCode: data.address.extendedPostalCode,
    country: data.address.country,
    street: data.address.street,
  })
);

const findByLongLat = async (location) => (
  tomTom.findOne({
    where: {
      longitude: location.lon,
      latitude: location.lat,
    }
  })
)

const findById = async (id) => (
  tomTom.findOne({
    where: {
      id: id
    }
  })
)

module.exports.createRecord = createRecord;
module.exports.findByLongLat = findByLongLat
module.exports.findById = findById