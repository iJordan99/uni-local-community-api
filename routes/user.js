const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/users'});
const auth = require('../controllers/auth.js');

const _user = require('../models/helpers/user.js');
const { validateUser, validateUserUpdate } = require('../controllers/validation.js');

router.get('/', auth ,getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.put('/', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/', auth, deleteUser);

async function getAll(ctx){
  let attributes = ['password'];
  const users = await _user.findWithout(attributes);

  if(users.length){
    ctx.body = users;
  } else {
    console.log('No users found');
  }
}

async function createUser(ctx){
  const body = ctx.request.body;
  await _user.create(body);
  ctx.status = 200;
}

async function updateUser(ctx){
  const body = ctx.request.body;
  let user = ctx.state.user;
  await _user.update(user,body);
  ctx.status = 200;
}

async function deleteUser(ctx){
  let user = ctx.state.user;
  await _user.delete(user);
  ctx.status = 200;
}

module.exports = router; 
