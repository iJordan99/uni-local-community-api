const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const _user = require('../models/helpers/user.js');
require('dotenv').config();
let options = {};
const date = new Date();
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET_KEY;


const checkJwt = new JwtStrategy(options, async (jwt_payload, done) => {
  let user = await _user.findByUsername(jwt_payload.username);

  if(user){
    console.log(`[${date}] | ${user.username} logged in via jwt`);
    return done(null, user)
  } else {
    return done(null, false)
  } 
})


module.exports = checkJwt;

