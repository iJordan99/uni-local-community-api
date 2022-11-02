const { sequelize,role} = require('../');

const getRole = (roleID) => {
  return role.findOne({
    where:{
      id: roleID
    },
    raw: true,
    nest: true
  });
};


module.exports.getRole = getRole;

