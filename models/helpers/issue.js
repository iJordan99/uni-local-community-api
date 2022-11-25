const { sequelize,issue} = require('../');

const getByStatus = (reqStatus, attributes) => {
  return issue.findAll({
    where: {
      status: reqStatus
    },
    raw: true,
    nest: true,
    attributes: {exclude: attributes}
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

const getByUUID = (id,attributes) => {

  if(!attributes){
    let attributes;
  }

  let IsIssue =  issue.findOne({
    where: {
      uuid: id,
    },
    raw: true,
    nest: true,
    attributes: {exclude: attributes}
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
    longitude: data.location.longitude,
    latitude: data.location.latitude,
    description: data.description,
    photo: data.photo,
    status: 'new',
    userId: user.id,    
    tomTomId: data.tomTomId
  });

  return issue.findOne({
    where: {
      issueName: data.issueName,
      userId: user.id
    },
    raw: true,
    nest: true,
  })

};

const findAllByUser = (userId, attributes) => {

  if(!attributes){
    let attributes;
  }

  return issue.findAll({
    where: {
      userId: userId
    },
    attributes: {exclude: attributes},
    raw: true,
    nest: true
  });
};

const updateStatus = (uuid, data) => {
  return issue.update({ status: data.status, updatedAt: new Date() },  
    {where: { uuid: uuid}}
  );
};

const getAll = (attributes) => {
  if(!attributes){
    let attributes;
  }

  return issue.findAll({
    attributes: {exclude: attributes},
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

const exists = (data,user) => (
  issue.findOne({
    where: {
      issueName: data.issueName,
      userId: user.id
    }
  })
)

const findByLocation = (location) => (
  issue.findOne({
    where: {
      longitude: location.longitude,
      latitude: location.latitude
    }
  })
)

module.exports.getByStatus = getByStatus;
module.exports.getById = getById;
module.exports.getByUUID = getByUUID;
module.exports.create = create;
module.exports.findAllByUser = findAllByUser;
module.exports.updateStatus = updateStatus;
module.exports.getAll = getAll;
module.exports.delete = deleteIssue;
module.exports.exists = exists;
module.exports.findByLocation = findByLocation;