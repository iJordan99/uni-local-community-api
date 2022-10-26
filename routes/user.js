const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/users'});
const auth = require('../controllers/auth.js');

const { sequelize, User } = require('../models');

router.get('/', getAll);
router.post('/', bodyParser() ,createUser);

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
    password: body.password
  });
  ctx.status = 200;
}

module.exports = router; 
