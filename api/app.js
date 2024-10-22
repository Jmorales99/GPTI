const Koa = require('koa');
const { koaBody } = require('koa-body');
const KoaLogger = require('koa-logger');
const cors = require('@koa/cors');
const { createServer } = require('node:http');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Server } = require('socket.io');
const router = require('./routes');
const orm = require('./models');

const app = new Koa();

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));

// Expose orm to koa context
app.context.orm = orm;

// Logs requests from the server
app.use(KoaLogger());

// Parse request body
app.use(koaBody());

const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('invalid key'));
  }

  if (token !== 'HOlaQHacasLollllxdd') {
    return next(new Error('invalid key'));
  }

  next();
});


app.context.io = io;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.keys = [`${process.env.APP_KEYS}`];
app.proxy = true;
// const isProd = process.env.NODE_ENV === 'production';

// const CONFIG = {
//   // key: 'koa.sess',
//   // maxAge: 86400000,
//   // autoCommit: true,
//   // overwrite: true,
//   httpOnly: false,
//   // signed: true,
//   // rolling: false,
//   // renew: false,
//   // secure: isProd,
//   // secureProxy: true,
//   // sameSite: 'None',
// };
// app.use(session(CONFIG, app));

app.use(router.routes());

app.on('error', (err) => {
  console.log(err);
});

module.exports = httpServer;
