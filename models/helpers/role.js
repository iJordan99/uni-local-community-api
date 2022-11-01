const { sequelize,Role} = require('../');

const getRole = (roleID) => {
  return Role.findOne({
    where:{
      id: roleID
    },
    raw: true,
    nest: true
  });
};


module.exports.getRole = getRole;

