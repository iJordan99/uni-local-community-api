const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/issue'});
const auth = require('../controllers/auth.js');

const can = require('../permissions/issue.js');

const _issue = require('../models/helpers/issue.js');
const _role = require('../models/helpers/role.js');
const _user = require('../models/helpers/user.js');

const { validateIssue, validateIssueStatus } = require('../controllers/validation.js');

//rework these routes ? should posting to the /:id update the status or the issue itself
router.get('/:id([0-9]{1,})', auth, bodyParser() ,issueById);
router.post('/:id([0-9]{1,})', auth, bodyParser(), validateIssueStatus, updateStatus);

router.get('/', auth, myIssues);
router.post('/', auth, bodyParser(), validateIssue ,createIssue);

router.get('/:username', auth, getByUser);
router.get('/status/:status', auth, getByStatus);

//if user views issues and sees status as addressed they should see a URI to apporve the fix (set status to fixed)

async function myIssues(ctx){
  let requester = ctx.state.user;
  const issues = await _issue.findAllByUser(requester.id);
  const host = 'https://disneysummer-basilhazard-3000.codio-box.uk';
  issues.map((issue) => {
    let date = new Date(issue.createdAt).toLocaleDateString();
    issue.createdAt = date;
    date = new Date(issue.updatedAt).toLocaleDateString();
    issue.updatedAt = date;

    if(issue.status === 'addressed'){
      issue.uri = `${host}/api/v1/issue/${issue.id}`  
    }
  });

  ctx.body = issues;
  ctx.sta = 200;
}

async function updateStatus(ctx){
  //only admin should be able to update status to flagged,addressed and new - allow users to set fixed
  const issueID = ctx.params.id;
  const data = ctx.request.body;
  let requester = ctx.state.user;
  requester = await _role.getRole(requester.RoleId);

  const permission = can.updateStatus(requester);
  const issue = _issue.getById(issueID);

  if(!permission.granted){
    ctx.status = 403;
  } else {
    await _issue.updateStatus(issueID, data);
    ctx.status = 200;
  }
}


async function getByStatus(ctx){
  //make this dynamic 
  const host = 'https://disneysummer-basilhazard-3000.codio-box.uk';
  let requester = ctx.state.user;
  
  const issues = await _issue.getByStatus(ctx.params.status);
  requester = await _role.getRole(requester.RoleId);  
  const permission = can.getByStatus(requester);

  if(!permission.granted){
    ctx.status = 403;
  } else {
    issues.map((issue) => {
      const date = new Date(issue.createdAt).toLocaleDateString();
      issue.createdAt = date;
      issue.URI = `${host}/api/v1/issue/${issue.id}`
    });

    ctx.body = issues;
    ctx.status = 200;
  }
}

async function issueById(ctx){ 
  let requester = ctx.state.user;
  let requesterRole = await _role.getRole(requester.RoleId);  
  requester.role = requesterRole.role;

  const issue = await _issue.getById(ctx.params.id)  

  const permission = can.getById(requester, issue);
  
  if(!permission.granted){
    ctx.status = 403;
  } else {
    const date = new Date(issue.createdAt).toLocaleDateString();
    issue.createdAt = date;
    ctx.body = issue;
    ctx.status = 200;
  }
}

async function createIssue(ctx){
  const data = ctx.request.body;
  let user = ctx.state.user;
  user = await _user.findByUsername(user.username)
  _issue.create(data,user);
  ctx.status = 200;
}

async function getByUser(ctx){
  let requester = ctx.state.user;
  let requesterRole = await _role.getRole(requester.RoleId);
  requester.role = requesterRole.role;
  
  let user = ctx.params.username; 
  user = await _user.findByUsername(user);

  const permission = can.getByUser(requester, user)
  const data = await _issue.findAllByUser(user.id);

  if(!permission.granted){
    ctx.status = 403;
  } else {
    if(data){
      ctx.body = data;
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }
  }
}



module.exports = router; 