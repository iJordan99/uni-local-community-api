const passport = require('koa-passport');
const basicAuth = require('../strategies/basic.js');

passport.use(basicAuth);

module.exports = passport.authenticate(['basic'], {session:false});