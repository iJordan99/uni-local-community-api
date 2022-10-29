const { sequelize,Role} = require('../');

const getRole = async (roleID) => {
  return await Role.findOne({
    where:{
      id: roleID
    },
    raw: true,
    nest: true,
  });
}


module.exports.getRole = getRole;
