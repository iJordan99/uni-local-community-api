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

const findById = async (id) => {
  return await User.findOne({
    where: {
      id: id
    },
    raw: true,
    nest: true
  })
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
    { where: { id: user }}
  );
}

const deleteUser = async(user) => {
  return await User.destroy({
    where: {
      id: user
    }
  });
}

module.exports.findByUsername= findByUsername;
module.exports.findWithout = findWithout;
module.exports.findById = findById;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = deleteUser;