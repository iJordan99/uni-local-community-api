const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/user'});
const auth = require('../controllers/auth.js');
const can = require('../permissions/user.js');

const _user = require('../models/helpers/user.js');
const _role = require('../models/helpers/role.js');
const { validateUser, validateUserUpdate } = require('../controllers/validation.js');

router.get('/', auth ,getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.put('/:id', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id', auth, deleteUser);

async function getAll(ctx){
  let requester = ctx.state.user;
  requester = await _role.getRole(requester.RoleId);  
  const permission = can.getAll(requester);

  if(!permission.granted){
    ctx.status = 403;
  } else {
    let attributes = ['password'];
    const users = await _user.findWithout(attributes);

    if(users){
      ctx.body = users;
      ctx.status = 200;
    } else {
      console.error('No users found');
      ctx.status = 204;
    }
  }
}

async function createUser(ctx){
  const body = ctx.request.body;
  if(_user.isNew){
    await _user.create(body);
    ctx.status = 200;
  } else {
    ctx.status = 302;
    console.error(`${body.username} already exists`);
  }  
}

async function updateUser(ctx){
  const data = ctx.request.body;
  
  let requester = ctx.state.user;
  
  let user = ctx.params.id; 
  user = await _user.findById(user);

  let requesterRole = await _role.getRole(requester.RoleId);
  requester.role = requesterRole.role;
  
  const permission = can.updateUser(requester,user);

  if(!permission.granted){
    ctx.status = 403;
  } else { 
    await _user.update(user,data);
    ctx.status = 200;  
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
  }
  ctx.status = 200;
}


module.exports = router; 
