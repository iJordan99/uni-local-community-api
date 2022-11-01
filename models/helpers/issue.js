const { sequelize,Issue} = require('../');

const getByStatus = (reqStatus) => {
  return Issue.findAll({
    where: {
      status: reqStatus
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['updatedAt', 'UserId', 'userID', 'photo', 'description', 'reportedBy', 'id']}
  });
};

const getById = (id) => {
  return Issue.findOne({
    where: {
      id: id,
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['updatedAt', 'id', 'userID']}
  });
};

const getByUUID = (id) => {
  let issue =  Issue.findOne({
    where: {
      uuid: id,
    },
    raw: true,
    nest: true,
    attributes: {exclude: ['id', 'userID']}
  });

  if(issue){
    return issue;
  } else {
    return false;
  }

};

const create = async (data,user) => {
  const create = await Issue.create({
    issueName: data.issueName ,
    location: data.location,
    description: data.description,
    photo: data.photo,
    status: 'new',
    reportedBy: user.username,
    userID: user.id,    
  });

  return Issue.findOne({
    where: {
      issueName: data.issueName,
      userID: user.id
    },
    raw: true,
    nest: true,
  })

};

const findAllByUser = (userID) => {
  return Issue.findAll({
    where: {
      userID: userID
    },
    attributes: {exclude: ['password', 'UserId', 'userID', 'id']},
    raw: true,
    nest: true
  });
};

const updateStatus = (issue, data) => {
  return  Issue.update({ status: data.status, updatedAt: new Date() },  
    {where: { uuid: issue}}
  );
};

const getAll = () => {
  return Issue.findAll({
    raw: true,
    nest: true
  });
}

const deleteIssue = (uuid) => {
  return Issue.destroy({
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