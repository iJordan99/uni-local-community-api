const { sequelize,Issue} = require('../');


const getByStatus = async (reqStatus) => {
  return await Issue.findAll({
    where: {
      status: reqStatus
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['updatedAt', 'UserId', 'userID', 'photo', 'description', 'reportedBy']}
  });
};

const getById = async (id) => {
  return Issue.findOne({
    where: {
      id: id,
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['updatedAt', 'id', 'UserId', 'userID']}
  });
};

const create = async(data,user) => {
  const create = await Issue.create({
    issueName: data.issueName ,
    location: data.location,
    description: data.description,
    photo: data.photo,
    status: 'new',
    reportedBy: user.username,
    userID: user.id,    
  });
};

const findAllByUser = async (userID) => {
  return Issue.findAll({
    where: {
      userID: userID
    },
    attributes: {exclude: ['password']},
    raw: true,
    nest: true
  });
};

module.exports.getByStatus = getByStatus;
module.exports.getById = getById;
module.exports.create = create;
module.exports.findAllByUser = findAllByUser;