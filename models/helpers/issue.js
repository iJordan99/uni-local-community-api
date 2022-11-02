const { sequelize,issue} = require('../');

const getByStatus = (reqStatus) => {
  return issue.findAll({
    where: {
      status: reqStatus
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['updatedAt', 'UserId', 'userID', 'photo', 'description', 'reportedBy', 'id']}
  });
};

const getById = (id) => {
  return issue.findOne({
    where: {
      id: id,
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['updatedAt', 'id', 'userID']}
  });
};

const getByUUID = (id) => {
  let IsIssue =  issue.findOne({
    where: {
      uuid: id,
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['id', 'userID']}
  });

  if(IsIssue){
    return IsIssue;
  } else {
    return false;
  }

};

const create = async (data,user) => {
  const create = await issue.create({
    issueName: data.issueName ,
    location: data.location,
    description: data.description,
    photo: data.photo,
    status: 'new',
    reportedBy: user.username,
    userID: user.id,    
  });

  return issue.findOne({
    where: {
      issueName: data.issueName,
      userID: user.id
    },
    raw: true,
    nest: true,
  })

};

const findAllByUser = (userID) => {
  return issue.findAll({
    where: {
      userID: userID
    },
    attributes: {exclude: ['password', 'UserId', 'userId', 'id']},
    raw: true,
    nest: true
  });
};

const updateStatus = (uuid, data) => {
  return issue.update({ status: data.status, updatedAt: new Date() },  
    {where: { uuid: uuid}}
  );
};

const getAll = () => {
  return issue.findAll({
    raw: true,
    nest: true
  });
}

const deleteIssue = (uuid) => {
  return issue.destroy({
    where: {
      uuid: uuid
    }
  });
}

module.exports.getByStatus = getByStatus;
module.exports.getById = getById;
module.exports.getByUUID = getByUUID;
module.exports.create = create;
module.exports.findAllByUser = findAllByUser;
module.exports.updateStatus = updateStatus;
module.exports.getAll = getAll;
module.exports.delete = deleteIssue;