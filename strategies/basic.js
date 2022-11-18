const BasicStrategy = require('passport-http').BasicStrategy;
// const { sequelize, user } = require('../models');
const _user = require('../models/helpers/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkPass = function(user, password){
  const isMatch = bcrypt.compareSync(password, user.password); 
  return isMatch;
}

const jwtVerify = () => {
  let options = [];
  options.clockTolerance = 10;
      
  let jwt_verified = jwt.verify(user.jwt, process.env.SECRET_KEY, options, (err, decoded) => { 
    if(decoded){
      return true;
    } else { return false; }
  });   
}

const createJwt = async (user,date) => {
  let token = await jwt.sign({
    username: user.username,
    name: user.firstName + ` ${user.lastName}`
  }, process.env.SECRET_KEY, {expiresIn: '2h'});      

  console.log(`[${date}] | ${user.username} logged in via basic`);
  console.log(`[${date}] | New JWT signed for ${username}`);

  await _user.updateJwt(user,token);
}

const checkCredentials = async (username, password, done) => {
  const date = new Date();
  const result = await _user.findByUsername(username);

  if(result){
    const user = result; 
    if(checkPass(user,password)){   
      if(!jwtVerify){
        createJwt(user,date);        
        return done(null, user);  
      } else {
        console.log(`[${date}] | ${user.username} logged in via basic`);
        return done(null, user);   
      }
    } else {
     console.log(`[${date}] | Credintials invalid for ${username}`);
    }
  } else {
    console.log(`[${date}] | No user found for ${username}`);
  }
  return done(null, false);
}

const strategy = new BasicStrategy(checkCredentials);
module.exports = strategy;

