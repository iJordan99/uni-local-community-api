const { sequelize,User} = require('../');

const findByUsername = (username) => {
  let user =  User.findOne({
    where: {
      username: username
    },
    raw: true,
    nest: true
  });

  if(user){
    return user;
  } else {
    return false;
  }

}

const findById = (id) => {
  return User.findOne({
    where: {
      id: id
    },
    raw: true,
    nest: true
  })
}

const findWithout = (attributes) => {
  return User.findAll({
    attributes: {exclude: attributes}
  });
};

const create = (data) => {
  return User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    password: data.password,
    roleID: 1
  });
}

const update = (user,data) => {
  return  User.update({ password: data.password, email: data.email, username: data.username},
    { where: { id: user }}
  );
}

const deleteUser = (user) => {
  return User.destroy({
    where: {
      id: user
    }
  });
}

const isUser = (data) => {
  let user = User.findOne({
    where: { username: data.username}
  });

  if(user){
    return false;
  } else {
    return user;
  }

}

module.exports.findByUsername= findByUsername;
module.exports.findWithout = findWithout;
module.exports.findById = findById;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = deleteUser;
module.exports.isUser = isUser;