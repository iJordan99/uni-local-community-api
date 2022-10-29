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

const findWithout = async (attributes) => {
  return await User.findAll({
    attributes: {exclude: attributes}
  });
};

const create = async(data) => {
  return await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    password: data.password,
    roleID: 1
  });
}

const update = async(user,data) => {
  return await User.update({ password: data.password, email: data.email, username: data.username},
    { where: { id: user.id }}
  );
}

const deleteUser = async(user) => {
  await User.destroy({
    where: {
      id: user.id
    }
  });
}

module.exports.findByUsername= findByUsername;
module.exports.findWithout = findWithout;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = deleteUser;