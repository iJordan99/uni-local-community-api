const koa = require('koa');
const app = new koa();

const special = require('./routes/special.js');
const user = require('./routes/user.js');
const issue = require('./routes/issue.js');

app.use(special.routes());
app.use(user.routes());
app.use(issue.routes());

let port = process.env.PORT || 3000;

app.listen(port);