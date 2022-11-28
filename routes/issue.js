const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const prefix = '/api/v1/issues';
const router = Router({prefix: prefix});
const auth = require('../controllers/auth.js');
const can = require('../permissions/issue.js');

//models
const _issue = require('../models/helpers/issue.js');
const _role = require('../models/helpers/role.js');
const _user = require('../models/helpers/user.js');
const _tomTom = require('../models/helpers/tomTom.js');

//middleware
const { validateIssue, validateIssueStatus } = require('../controllers/validation.js');

const etag = require('etag');
const { checkHeaders } = require('./helpers/conditional.js');

const { getDistance } = require('geolib');

//external api
const tomtom = require('../integrations/tomtom.js');

router.get('issues','/', auth, myIssues);

router.post('issues', '/', auth, bodyParser(), validateIssue ,createIssue);

router.get('issueById','/:uuid', auth, issueByUUID);
router.delete('issueById','/:uuid', auth, deleteIssue);
router.put('statusUpdate','/:uuid', auth, bodyParser(), validateIssueStatus, updateStatus);

router.get('location', '/near/location', auth, byLocation);

const getLinks = (ctx,issue) => ({
  self: ctx.protocol + 's://' + ctx.host + router.url('issueById', issue.uuid)
})

async function getPages(filters,maxPage,ctx,next){
  if(filters.page > maxPage){
    ctx.status = 404;
    return next;
  } else{ return true; }
}

async function byLocation(ctx){
  let query = ctx.query; 
  const filters = {
    status: query.status,
    limit: query.limit,
    page: query.page
  }
  const longitude = query.longitude;
  const latitude = query.latitude;

  let requester = ctx.state.user;
  let role = await _role.getRole(requester.roleId);

  let exclude = ['password','userId', 'id', 'description', 'photo', 'createdAt', 'updatedAt', 'issueName', 'tomTomId'];

  let issues;
  let maxPage; 
  if(role.role == 'user'){
    issues = await _issue.findAllByUser(requester.id, exclude,filters);
    maxPage = await _issue.findAllUserByStatus(requester.id,exclude,filters.status)
  } else {
    issues = await _issue.getAll(exclude,filters);
    maxPage = await _issue.getOnlyStatus(exclude,filters.status);
  }

  let count = maxPage.length;
  maxPage = Math.ceil(count / parseInt(filters.limit));
  let pages = await getPages(filters,maxPage,ctx)

  if(pages){
    let statusString = filters.status ? `status=${filters.status}&` : '';
    let pageString = filters.page ? `page=${parseInt(filters.page)+1}&` : '';
    let limitString = filters.limit ? `limit=${parseInt(filters.limit)}` : '';

    let url = filters.status ? status=`${filters.status}&` : '' + filters.page ? `page=${parseInt(filters.page)+1}` : '';
    url = url + filters.limit ? `limit=${parseInt(filters.limit)}` : '';

    issues.map((issue) => {
      if(issue.latitude && issue.longitude){
        let distance = getDistance(
        { latitude: latitude, longitude: longitude},
        { latitude: issue.latitude, longitude: issue.longitude}, 1);
        issue.differenceInMetres = distance;
        issue.links = getLinks(ctx,issue)
      }
    });

    if(parseInt(filters.page) != maxPage){
      links = {
        next: ctx.protocol + 's://' + ctx.host + `${prefix}/location/${longitude}/${latitude}` + '?' + statusString + pageString + limitString
      }
      issues = issues.concat(links);
    }
    let updated;
    const Etag = etag(JSON.stringify(issues));
    const is304 = checkHeaders(ctx,updated,Etag);

    issues.sort((a,b) => a.difference - b.difference);

    if(!is304){
      ctx.body = issues;
      ctx.set('Etag', Etag);
      ctx.status = 200;
      ctx.type = 'application/json';
    }else { ctx.status = 304; }
  }
}

async function deleteIssue(ctx){
  let issueUUID = ctx.params.uuid;
  let requester = ctx.state.user;
  requesterRole = await _role.getRole(requester.roleId);
  requester.role = requesterRole.role

  const issue = await _issue.getByUUID(issueUUID);

  if(issue){
    const permission = can.deleteIssue(requester,issue);
    if(!permission.granted){
      ctx.status = 403;
    } else {
      await _issue.delete(issueUUID);
      ctx.status = 200;
      ctx.type = 'application/json';
    }
  } else {
    ctx.status = 404;
  }
}

async function myIssues(ctx,next){
  let filters = ctx.query;
  let requester = ctx.state.user;
  let role = await _role.getRole(requester.roleId);
  let issues;
  let exclude = ['password', 'userId', 'id', 'description', 'photo', 'createdAt', 'updatedAt', 'longitude', 'latitude', 'tomTomId'];
  
  let maxPage;

  if(role.role == 'user'){
    issues = await _issue.findAllByUser(requester.id, exclude,filters);
    maxPage = await _issue.findAllUserByStatus(requester.id,exclude,filters.status)
  } else {
    issues = await _issue.getAll(exclude,filters);
    maxPage = await _issue.getOnlyStatus(exclude,filters.status);
  }

  issues.map((issue) => {
    issue.links = getLinks(ctx,issue);
  });

  let count = maxPage.length;
  maxPage = Math.ceil(count / parseInt(filters.limit));
  let pages = await getPages(filters,maxPage,ctx)

  if(pages){
    let statusString = filters.status ? `status=${filters.status}&` : '';
    let pageString = filters.page ? `page=${parseInt(filters.page)+1}&` : '';
    let limitString = filters.limit ? `limit=${parseInt(filters.limit)}` : '';

    let url = filters.status ? status=`${filters.status}&` : '' + filters.page ? `page=${parseInt(filters.page)+1}` : '';
    url = url + filters.limit ? `limit=${parseInt(filters.limit)}` : '';
    if(parseInt(filters.page) != maxPage){
      links = {
        next: ctx.protocol + 's://' + ctx.host + router.url('issues') + '?' + statusString + pageString + limitString
      }
      issues = issues.concat(links);
    }
    let updated;
    const Etag = etag(JSON.stringify(issues));
    const is304 = checkHeaders(ctx,updated,Etag);

    if(!is304){
      ctx.body = issues;
      ctx.set('Etag', Etag);
      ctx.status = 200;
      ctx.type = 'application/json';
    }else { ctx.status = 304; }
  }
}

async function updateStatus(ctx){
  const issueUUID = ctx.params.uuid;
  let data = ctx.request.body;
  let requester = ctx.state.user;

  const requesterId = requester.id;
  requester = await _role.getRole(requester.roleId);
  
  const issue = await _issue.getByUUID(issueUUID);

  let permission;
  
  if(issue){
    if(requester.role != 'admin'){

      if(requesterId != issue.userId ){
        ctx.status = 403;
        return;
      } else {
        permission = can.updateStatus(requester,data);
      }

    } else { permission = can.updateStatus(requester,data); }

      if(!permission.granted){
        ctx.status = 403;
      } else {
        await _issue.updateStatus(issueUUID, data);
        let updated = await _issue.getByUUID(issueUUID);
        let updatedAt = new Date(updated.updatedAt).toLocaleDateString(); ;
        ctx.body = { uuid: updated.uuid, updatedAt: updatedAt, status: updated.status,
            links: getLinks(ctx,updated)
        };
        ctx.status = 200;
        ctx.type = 'application/json';
      }
  } else {
    ctx.status = 404;
  } 
}

async function issueByUUID(ctx,next){ 
  let requester = ctx.state.user;
  let requesterRole = await _role.getRole(requester.roleId);  
  requester.role = requesterRole.role;

  let exclude = ['id'];
  const issue = await _issue.getByUUID(ctx.params.uuid, exclude)  
  let tomTomRecord = await _tomTom.findById(issue.tomTomId);
  
  if(issue){
    const permission = can.getById(requester, issue);

    if(!permission.granted){
      ctx.status = 403;
    } else {
      issue.location = {
        "longitude": issue.longitude,
        "latitude": issue.latitude,
        "streetName": tomTomRecord.streetName,
        "countryCode": tomTomRecord.countryCode,
        "postcode": tomTomRecord.postalCode,
        "county": tomTomRecord.countrySecondarySubdivision,
        "city": tomTomRecord.municipality,
      };
      let date = new Date(issue.createdAt).toLocaleDateString();
      issue.createdAt = date;
      const updated = issue.updatedAt;
      date = new Date(issue.updatedAt).toLocaleDateString();
      issue.updatedAt = date;

      issue.links = issue.links = getLinks(ctx,issue);

      delete(issue.userId);
      delete(issue.longitude);
      delete(issue.latitude);
      delete(issue.tomTomId);

      const Etag = etag(JSON.stringify(issue));
      const is304 = checkHeaders(ctx,updated,Etag);
      
      if(!is304){
        ctx.body = issue;
        ctx.set('Last-Modified', new Date(updated).toUTCString())
        ctx.set('Etag', Etag);
        ctx.status = 200;
        ctx.type = 'application/json';
      }else { ctx.status = 304; }
    }
  } else{
    ctx.status = 404;
  }
}

async function createIssue(ctx){
  const data = ctx.request.body;

  let user = ctx.state.user;
  user = await _user.findByUsername(user.username)

  let issueExists = await _issue.exists(data,user);

  if(!issueExists){
    
    let apiCallMethod;
    let apiCallParams;
    let tomTomRecord;
    let tomTomData;
    let tomTomId;
    let newIssue;

    if(data.location.longitude){
      apiCallMethod = tomtom.getReverseGeo;
      apiCallParams = `${data.location.longitude},${data.location.latitude}`;
      tomTomData = await apiCallMethod(apiCallParams);
      tomTomData.position = {
          lon: data.location.longitude,
          lat: data.location.latitude
      }
    } else {
      apiCallMethod = tomtom.getGeo;
      apiCallParams = [{
        "countryCode": data.location.countryCode,
        "streetName": data.location.streetName,
        "streetNumber": data.location.streetNumber,
        "postcode": data.location.postcode
      }];

      tomTomData = await apiCallMethod(apiCallParams);
    }

    tomTomRecord = await _tomTom.findByLongLat(tomTomData.position);
  
    if(!tomTomRecord){
      const newTomTomRecord = await _tomTom.createRecord(tomTomData);

      data.tomTomId = newTomTomRecord.id;
    } else {
      data.location = {
        longitude: tomTomRecord.longitude,
        latitude: tomTomRecord.latitude
      }
      data.tomTomId = tomTomRecord.id
    }

    newIssue = await _issue.create(data,user);  

    ctx.body = { issueName: newIssue.issueName, uuid: newIssue.uuid,
      links: getLinks(ctx,newIssue)
    };

    ctx.status = 201;
    ctx.type = 'application/json';
  } else {
    ctx.status = 409;
  }
}

module.exports = router; 