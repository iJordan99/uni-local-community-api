const { sequelize,User} = require('../');


const findByUsername = async (username) => {
  return await User.findOne({
    where: {
      username: username
    },
    raw: true,
    nest: true
  });
}

module.exports.findByUsername= findByUsername;