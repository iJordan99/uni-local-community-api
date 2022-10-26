const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/issues'});

const { sequelize,Issue,User} = require('../models');

async function getByUser(ctx){
  const username = ctx.params.username;

  // const issues = await User.findAll({
  //   include: Issue,
  //   attributes: {exclude: ['password']},
  //   where: {
  //     '$User.username$': username
  //   },
  //   raw: true,
  //   nest: true
  // }
  // );


  //find user
  const user = await User.findAll({
    where: {
      username: username
    },
    raw: true,
    nest: true
  });

  try{
    //if user exists set id
    const userID = user[0].id;
    //get issues by user if any
    const issues = await Issue.findAll({
      where: {
        userID: userID
      },
      attributes: {exclude: ['password']},
    });
    
    if(issues.length){
      ctx.body = issues;
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }

  } catch { 
    //error handling here
  }
}

router.get('/:username', getByUser);





module.exports = router; 