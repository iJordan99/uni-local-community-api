const BasicStrategy = require('passport-http').BasicStrategy;
const { sequelize, User } = require('../models');
const bcrypt = require('bcrypt');

const checkPass = function(user, password){
  const isMatch = bcrypt.compareSync(password, user.password); 
  return isMatch;
}

const checkCredentials = async (username, password, done) => {

  const result = await User.findOne({
      where: {
        username: username
      },
      raw: true
    });
  
  if(result){
    const user = result; 
    if(checkPass(user,password)){    
      return done(null, user);
    } else {
     console.log(`Credintials invalid for ${username}`);
    }
  } else {
    console.log(`No user found for ${username}`);
  }
  return done(null, false);
}

const strategy = new BasicStrategy(checkCredentials);
module.exports = strategy;

