const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/v1'});

const welcomeAPI = (ctx) => { ctx.body = {message: 'Welcome to the API' }};

router.get('/', welcomeAPI);

module.exports = router;