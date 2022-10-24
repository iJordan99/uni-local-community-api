const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/users'});

const { sequelize, User } = require('../models');

async function getAll(ctx){
  const users = await User.findAll({
    attributes: {exclude: ['password']}
  });

  if(users.length){
    console.log(users);
    ctx.body = users;
  } else {
    console.log('No users found');
  }
}

router.get('/', getAll);





module.exports = router; 
