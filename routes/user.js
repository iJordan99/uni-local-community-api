const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/users'});
const auth = require('../controllers/auth.js');
const can = require('../permissions/user.js');

const _user = require('../models/helpers/user.js');
const _role = require('../models/helpers/role.js');
const { validateUser, validateUserUpdate } = require('../controllers/validation.js');

router.get('user','/', auth ,getInfo);
router.post('user','/', bodyParser(), validateUser, createUser);
router.put('user','/:id', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('user','/:id', auth, deleteUser);

const getLinks = (ctx) => ({
  self: ctx.protocol + 's://' + ctx.host + router.url('user')
})

async function getInfo(ctx){
  let requester = ctx.state.user;
  requester = await _role.getRole(requester.roleId);  

  let attributes = ['password', 'roleId', 'createdAt', 'updatedAt', 'id'];
  if(requester.role == 'user'){
    const user = await _user.findUser(ctx.state.user,attributes);
    user.links = getLinks(ctx);
    ctx.body = user;
    ctx.status = 200;
  } else {
    const users = await _user.findWithout(attributes);
    const permission = can.getAll(requester);
    if(!permission.granted){
      ctx.status = 403;
    } else {
      if(users){
        ctx.body = users;
        ctx.status = 200;
      } else {
        console.error('No users found');
        ctx.status = 404;
      }
    }
  }
}

async function createUser(ctx){
  const body = ctx.request.body;

  let isUser = await _user.isUser(body);
  //need to check if email exists     
  if(isUser != ''){
    await _user.create(body);
    body.links = getLinks(ctx);
    ctx.body = body;
    ctx.status = 201;
  } else {
    ctx.status = 400;
    console.error(`${body.username} already exists`);
  }  
}

async function updateUser(ctx){
  const data = ctx.request.body;
  
  let requester = ctx.state.user;
  
  let user = ctx.params.id; 
  user = await _user.findById(user);

  let requesterRole = await _role.getRole(requester.roleId);
  requester.role = requesterRole.role;
  
  const permission = can.updateUser(requester,user);

  if(!permission.granted){
    ctx.status = 403;
  } else { 
    await _user.update(user,data);
    ctx.status = 204;  
  }
}

async function deleteUser(ctx){
  let user = ctx.params.id;
  let requester = ctx.state.user;
  requester = await _role.getRole(requester.RoleId);  
  const permission = can.getAll(requester);

  if(!permission.granted){
    ctx.status = 403;
  } else {
    await _user.delete(user);
    ctx.status = 204;
  }
}


module.exports = router; 
