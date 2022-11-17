const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1'});
const auth = require('../controllers/auth.js');

const _user = require('../models/helpers/user.js');
const _role = require('../models/helpers/role.js');

const welcomeAPI = (ctx) => { ctx.body = {message: 'Welcome to the API' }};

router.get('/', welcomeAPI);

router.get('login', '/login', auth, login);


async function login(ctx){

  let requester = ctx.state.user;

  ctx.body = { token: requester.jwt}

}



module.exports = router;