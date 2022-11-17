const passport = require('koa-passport');
const basicAuth = require('../strategies/basic.js');
const jwt = require('../strategies/jwt.js')


passport.use('basic',basicAuth);
passport.use('jwt',jwt);

module.exports = passport.authenticate(['basic', 'jwt'], {session:false});