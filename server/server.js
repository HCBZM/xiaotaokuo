const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const static = require('./static_file');
const rest = require('./rest').rest;
const cors = require('./cors');

const app = new Koa;

// cors
app.use(cors());

// static assets
app.use(static('/static', __dirname + '/static'));

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});


// body parse
app.use(bodyParser());

// restful api
app.use(rest('/api'));

// controller 
app.use(controller());

app.listen(3333);