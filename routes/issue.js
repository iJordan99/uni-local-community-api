const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1/issue'});
const auth = require('../controllers/auth.js');
const { sequelize,Issue,User} = require('../models');

const { validateIssue } = require('../controllers/validation.js');

router.post('/', auth, bodyParser(), validateIssue ,createIssue);
router.get('/:username', getByUser);


async function createIssue(ctx){

  const body = ctx.request.body;
  const user = ctx.state.user;
  const create = await Issue.create({
    issueName: body.issueName ,
    location: body.location,
    description: body.description,
    photo: body.photo,
    status: 'new',
    owner: user.username,
    userID: user.id,    
  });
  ctx.status = 200;
}



async function getByUser(ctx){
  const username = ctx.params.username;
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







module.exports = router; 