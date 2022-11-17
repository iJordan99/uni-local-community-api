const { sequelize,role} = require('../');

const getRole = (roleID) => (
  role.findOne({
    where:{
      id: roleID
    },
    raw: true,
    nest: true
  })
)


module.exports.getRole = getRole;

