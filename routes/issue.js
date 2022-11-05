const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const prefix = '/api/v1/issues';
const router = Router({prefix: prefix});
const auth = require('../controllers/auth.js');

const can = require('../permissions/issue.js');

const _issue = require('../models/helpers/issue.js');
const _role = require('../models/helpers/role.js');
const _user = require('../models/helpers/user.js');

const { validateIssue, validateIssueStatus } = require('../controllers/validation.js');

const { getDistance } = require('geolib');

router.get('issues','/', auth, myIssues);
router.post('issues', '/', auth, bodyParser(), validateIssue ,createIssue);

router.get('issueById','/:uuid', auth, issueByUUID);
router.delete('issueById','/:uuid', auth, deleteIssue);
router.put('statusUpdate','/:uuid', auth, bodyParser(), validateIssueStatus, updateStatus);

router.get('statusFilter', '/status/:status', auth, getByStatus);

router.get('userFilter','/user/:username', auth, getByUser);

router.get('location', '/location/:longitude/:latitude', auth, byLocation);

const getLinks = (ctx,issue) => ({
  self: ctx.protocol + 's://' + ctx.host + router.url('issueById', issue.uuid)
})

async function byLocation(ctx){
  let params = ctx.params;
  const longitude = params.longitude;
  const latitude = params.latitude;

  let requester = ctx.state.user;

  let exclude = ['password','userId', 'id', 'description', 'photo', 'createdAt', 'updatedAt', 'status', 'issueName'];

  //add filtering by user or make admin only
  let allIssues = await _issue.findAllByUser(requester.id,exclude);
  
  allIssues.map((issue) => {
    let distance = getDistance(
      { latitude: latitude, longitude: longitude},
      { latitude: issue.latitude, longitude: issue.longitude}, 1
    );

    issue.difference = distance;
    issue.links = getLinks(ctx,issue)

  });

  allIssues.sort((a,b) => a.difference - b.difference);
  ctx.body = allIssues;
  ctx.status = 200;
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
    }
  } else {
    ctx.status = 404;
  }
}

async function myIssues(ctx){
  let requester = ctx.state.user;
  let role = await _role.getRole(requester.roleId);
  let issues;
  let exclude = ['password', 'userId', 'id', 'description', 'photo', 'createdAt', 'updatedAt', 'longitude', 'latitude'];

  if(role.role == 'user'){
    issues = await _issue.findAllByUser(requester.id, exclude);
  } else {
    issues = await _issue.getAll(exclude);
  }

  issues.map((issue) => {
    issue.links = getLinks(ctx,issue);
  });
  
  ctx.body = issues;
  ctx.status = 200;
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
      }
  } else {
    ctx.status = 404;
  } 
}

async function getByStatus(ctx){
  let requester = ctx.state.user;
  
  let exclude = ['updatedAt', 'userId', 'photo', 'description', 'reportedBy', 'id', 'longitude', 'latitude'];
  const issues = await _issue.getByStatus(ctx.params.status,exclude);
  requester = await _role.getRole(requester.roleId);  
  const permission = can.getByStatus(requester);

  if(!permission.granted){
    ctx.status = 403;
  } else {
    if(issues != ''){
      issues.map((issue) => {
        const date = new Date(issue.createdAt).toLocaleDateString();
        issue.createdAt = date;
        issue.links = getLinks(ctx,issue);
      });

      ctx.body = issues;
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }   
  }
}

async function issueByUUID(ctx){ 
  let requester = ctx.state.user;
  let requesterRole = await _role.getRole(requester.roleId);  
  requester.role = requesterRole.role;

  let exclude = ['id'];
  const issue = await _issue.getByUUID(ctx.params.uuid, exclude)  
  
  if(issue){
    const permission = can.getById(requester, issue);
    if(!permission.granted){
      ctx.status = 403;
    } else {

      let date = new Date(issue.createdAt).toLocaleDateString();
      issue.createdAt = date;
      date = new Date(issue.updatedAt).toLocaleDateString();
      issue.updatedAt = date;

      issue.links = issue.links = getLinks(ctx,issue);

      delete(issue.userId);
      
      ctx.body = issue;
      ctx.status = 200;
    }
  } else{
    ctx.status = 404;
  }
}

async function createIssue(ctx){
  const data = ctx.request.body;
  let user = ctx.state.user;
  user = await _user.findByUsername(user.username)

  let isNew = await _issue.isNew(data,user);

  if(!isNew){
    const newData = await _issue.create(data,user);

     ctx.body = { issueName: newData.issueName, uuid: newData.uuid,
      links: getLinks(ctx,newData)
    };
    ctx.status = 201;
  } else {
    ctx.status = 409;
  }
}

async function getByUser(ctx){
  let requester = ctx.state.user;  
  let requesterRole = await _role.getRole(requester.roleId);
  requester.role = requesterRole.role;
  
  let user = ctx.params.username; 
  user = await _user.findByUsername(user);

  let exclude = ['password', 'userId', 'id', 'description', 'photo', 'createdAt', 'updatedAt', 'longitude', 'latitude'];

  if(!user){
    ctx.status = 404;
  } else {
    const permission = can.getByUser(requester, user)
    const issues = await _issue.findAllByUser(user.id,exclude);
    
    if(!permission.granted){
      ctx.status = 403;
    } else {
      if(issues){
        issues.map((issue) => {
          issue.links = getLinks(ctx,issue);
        });
        ctx.body = issues;
        ctx.status = 200;
      } else {
        ctx.status = 404;
      }
    }
  } 
}



module.exports = router; 