const { sequelize,user} = require('../');

const findUser = (data, attributes) => (
  user.findOne({
    where: {
      id: data.id
    },
    attributes: {exclude: attributes},
    raw: true,
    nest: true
  })
)

const findByUsername = (username) => {
  let IsUser =  user.findOne({
    where: {
      username: username
    },
    raw: true,
    nest: true
  });

  if(IsUser){
    return IsUser;
  } else {
    return false;
  }

}

const findById = (id) => {
  return user.findOne({
    where: {
      id: id
    },
    raw: true,
    nest: true
  })
}

const findWithout = (attributes) => {
  return user.findAll({
    attributes: {exclude: attributes}
  });
};

const create = (data) => {
  return user.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    password: data.password,
    roleId: 1
  });
}

const update = (user,data) => {
  return  user.update({ password: data.password, email: data.email, username: data.username},
    { where: { id: user }}
  );
}

const deleteUser = (user) => {
  return user.destroy({
    where: {
      id: user
    }
  });
}

const isUser = async (data) => {
  let isUser = await user.findOne({
    where: {
      [Op.or]: [{username: data.username}, {email: data.email}]
    }
  
  });

  if(isUser){
    return false;
  } else {
    return isUser;
  }
}

module.exports.findByUsername= findByUsername;
module.exports.findWithout = findWithout;
module.exports.findById = findById;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = deleteUser;
module.exports.isUser = isUser;
module.exports.findUser = findUser;