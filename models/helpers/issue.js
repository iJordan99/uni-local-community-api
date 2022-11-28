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

const findAllUserByStatus = (userId,attributes,status) => {
  if(!attributes){
    let attributes;
  }

  if(status){
    return issue.findAll({
      where:{
        userId: userId,
        status: status
      },
      raw: true,
      nest: true
    });
  } else {
    return issue.findAll({
      where:{
        userId: userId
      },
      raw: true,
      nest: true
    });
  }
}

const getOnlyStatus = (attributes,status) => {
  if(!attributes){
    let attributes;
  }

  if(status){
    return issue.findAll({
      where:{
        status: status
      },
      raw: true,
      nest: true
    });
  } else {
    return issue.findAll({
      raw: true,
      nest: true
    });
  }
}

const findAllByUser = (userId, attributes,filters) => {

  if(!attributes){
    let attributes;
  }
  
  if(!filters.limit){
    filters.limit = 50;
  }

  if(!filters.page){
    filters.page = 1;
  }

  if(!filters.status){
    return issue.findAll({
      where: {
        userId: userId
      },
      ...paginate(
        parseInt(filters.page), parseInt(filters.limit)
      ),
      raw: true,
      nest: true,
      attributes: {exclude: attributes}
    })
  } else {
    return issue.findAll({
      where: {
        status: filters.status,
        userId: userId
      },
      ...paginate(
        parseInt(filters.page), parseInt(filters.limit)
      ),
      raw: true,
      nest: true,
      attributes: {exclude: attributes}
    })
  }
}

const paginate = (page, limit) => {
  let offset = page * limit;
  offset =  offset - limit;

  return {
    offset,
    limit,
  };
}

const getAll = (attributes,filters) => {
  if(!attributes){
    let attributes;
  }

  if(!filters.limit){
    filters.limit = 50;
  }

  if(!filters.page){
    filters.page = 1;
  }

  if(!filters.status){
    return issue.findAll({
      ...paginate(
        parseInt(filters.page), parseInt(filters.limit)
      ),
      raw: true,
      nest: true,
      attributes: {exclude: attributes}
    })
  } else {
    return issue.findAll({
      where: {
        status: filters.status
      },
      ...paginate(
        parseInt(filters.page), parseInt(filters.limit)
      ),
      raw: true,
      nest: true,
      attributes: {exclude: attributes}
    })
  }
}

const updateStatus = (uuid, data) => {
  return issue.update({ status: data.status, updatedAt: new Date() },  
    {where: { uuid: uuid}}
  );
};

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
module.exports.getByUUID = getByUUID;
module.exports.create = create;
module.exports.findAllByUser = findAllByUser;
module.exports.updateStatus = updateStatus;
module.exports.getAll = getAll;
module.exports.delete = deleteIssue;
module.exports.exists = exists;
module.exports.findByLocation = findByLocation;
module.exports.findAllUserByStatus = findAllUserByStatus
module.exports.getOnlyStatus = getOnlyStatus
