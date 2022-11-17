const koa = require('koa');
const cors = require('@koa/cors')
require('dotenv').config()
const app = new koa();


app.use(cors());

const special = require('./routes/special.js');
const user = require('./routes/user.js');
const issue = require('./routes/issue.js');

app.use(special.routes());
app.use(user.routes());
app.use(issue.routes());

let port = process.env.PORT || 3000;

app.listen(port);