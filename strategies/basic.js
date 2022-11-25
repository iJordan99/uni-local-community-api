const BasicStrategy = require('passport-http').BasicStrategy;
const _user = require('../models/helpers/user.js');
const bcrypt = require('bcrypt');

require('dotenv').config()
const date = new Date();
const checkPass = function(user, password){
  const isMatch = bcrypt.compareSync(password, user.password); 
  return isMatch;
}

const checkCredentials = async (username, password, done) => {
  const result = await _user.findByUsername(username);

  if(result){
    const user = result; 
    if(checkPass(user,password)){   
      return done(null, user);
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

