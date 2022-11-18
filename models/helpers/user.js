const { sequelize,user, role} = require('../');
const { Op } = require("sequelize");

const findWithRole = (username, attributes) => (
  user.findOne({
    where: {
      username: username
    },
    raw: true,
    nest: true,
    include: role
  })
)

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

const findByUsername = (username, attributes) => (
  user.findOne({
    where: {
      username: username
    },
    raw: true,
    nest: true,
    attributes: {exclude: attributes}
  })
)

const findById = (id) => (
  user.findOne({
    where: {
      id: id
    },
    raw: true,
    nest: true
  })
)

const findWithout = (attributes) => (
  user.findAll({
    attributes: {exclude: attributes}
  })
)

const create = (data,token) => (
  user.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    password: data.password,
    roleId: 1,
    jwt: token
  })
)

const update = (requester,data) => (
  user.update({ password: data.password, email: data.email, username: data.username},
    { where: { id: requester.id }}
  )
)

const updateJwt = (requester, data) => {
  user.update(
    { jwt: data }, {
      where:{
        id: requester.id
      }
    }
  )
}

const isUser = (data) => (
  user.findOne({
    where: {
      [Op.or]: [{ email: data.email }, { username: data.username}]
    }
  })
)

const deleteUser = (username) => (
  user.destroy({
    where: {
      username: username
    }
  })
)

module.exports.findWithRole = findWithRole;
module.exports.findByUsername= findByUsername;
module.exports.findWithout = findWithout;
module.exports.findById = findById;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = deleteUser;
module.exports.isUser = isUser;
module.exports.findUser = findUser;
module.exports.updateJwt = updateJwt;