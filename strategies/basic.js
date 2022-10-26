const BasicStrategy = require('passport-http').BasicStrategy;
const { sequelize, User } = require('../models');
const bcrypt = require('bcrypt');

const checkPass = function(user, password){
  const isMatch = bcrypt.compareSync(password, user.password); 
  return isMatch;
}


const checkCredentials = async (username, password, done) => {
  let result;

  try {
    result = await User.findOne({
      where: {
        username: username
      },
      raw: true
    });
  } catch {
    //return no user found
    
  }

  if(Object.keys(result).length){
    const user = result;
   
    if(checkPass(user,password)){    
      return done(null, user);
    } else {
     console.log(`Credintials invalid for ${username}`);
    }
  } else {
    console.log(`No user found`);
  }
  return done(null, false);
}


const strategy = new BasicStrategy(checkCredentials);
module.exports = strategy;

