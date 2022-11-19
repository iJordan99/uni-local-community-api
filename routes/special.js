const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1'});
const auth = require('../controllers/auth.js');

const _user = require('../models/helpers/user.js');
const _role = require('../models/helpers/role.js');

const jwt = require('jsonwebtoken');
const date = new Date();
const welcomeAPI = (ctx) => { ctx.body = {message: 'Welcome to the API' }};

router.get('/', welcomeAPI);

router.get('login', '/login', auth, login);

async function login(ctx){
  let token;
  let requester = ctx.state.user;

  if(jwtVerify(requester)){
    console.log(`[${date}] | ${requester.username} logged in via basic`);
    token = requester.jwt;
  } else {
    token = await createJwt(requester,date);        
  }
  ctx.body = { token: token}
  ctx.status = 200;
}

const jwtVerify = (requester) => {
  let options = [];
  options.clockTolerance = 10;
  
  let verified;
  let jwt_verified = jwt.verify(requester.jwt, process.env.SECRET_KEY, options, (err, decoded) => { 
    if(decoded){
      verified = true;
    } else { verified = false }
  });  

  return verified;
}

const createJwt = async (requester,date) => {
  let token = await jwt.sign({
    username: requester.username,
    name: requester.firstName + ` ${requester.lastName}`
  }, process.env.SECRET_KEY, {expiresIn: '2h'});      

  console.log(`[${date}] | ${requester.username} logged in via basic`);
  console.log(`[${date}] | New JWT signed for ${requester.username}`);

  await _user.updateJwt(requester,token);
  return token;
}

module.exports = router;