const app = require('./app');
let port = process.env.PORT;

app.listen(port);

console.log(`API running on the following port ${port}`);

