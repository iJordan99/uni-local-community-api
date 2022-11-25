const axios = require('axios');
require('dotenv').config();

const key = process.env.apiKeyTomTom;
let url;
let result;
const base = `https://api.tomtom.com/search/2/`;
const config = {
  method: 'get'
}

const getReverseGeo = async (position) => {  
  config.url = `${base}reverseGeocode/${position}.json?key=${key}`;
  result = await axios(config);
  if(result.status == 200 && result.headers['tracking-id']){
    result = {
      address: result.data.addresses[0].address,
    }
    return result;
  } else { return undefined; }
}

const getGeo = async (address) => {

  address = address[0];

  config.url = `${base}structuredGeocode.json?countryCode=${address.countryCode}&streetNumber=${address.streetNumber}&streetName=${address.streetName}&postalCode=${address.postcode}&key=${key}`;

  result = await axios(config);

  if(result.status == 200 && result.headers['tracking-id']){  
    result = {
      address: result.data.results[0].address,
      position: result.data.results[0].position
    };
    
    return result;
  } else { return undefined; }
}

module.exports.getReverseGeo = getReverseGeo;
module.exports.getGeo = getGeo;