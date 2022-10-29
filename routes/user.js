const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/user'});
const auth = require('../controllers/auth.js');

const { sequelize, User } = require('../models');
const { validateUser, validateUserUpdate } = require('../controllers/validation.js');

router.get('/', auth ,getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.put('/:username', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:username', auth, deleteUser);

async function getAll(ctx){
  const users = await User.findAll({
    attributes: {exclude: ['password']}
  });

  if(users.length){
    ctx.body = users;
  } else {
    console.log('No users found');
  }
}

async function createUser(ctx){
  const body = ctx.request.body;
  
  const create = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    username: body.username,
    email: body.email,
    password: body.password,
    roleID: 1
  });

  ctx.status = 200;
}

async function updateUser(ctx){
  const body = ctx.request.body;
  const user = await User.findOne({
    attributes: {exclude: ['password']},
    where: {
      username: ctx.params.username
    },
    raw: true,
    nest: true
  });

  User.update({ password: body.password, email: body.email, username: body.username},
    { where: { id: user.id }}
  );

  ctx.status = 200;
}

async function deleteUser(ctx){
  const user = await User.findOne({
    where: {
      username: ctx.params.username
    },
    raw: true,
    nest: true
  });

  User.destroy({
    where: {
      id: user.id
    }
  });

  console.log(`${user.username} deleted \n ${user}`);

  ctx.status = 200;
}

module.exports = router; 
