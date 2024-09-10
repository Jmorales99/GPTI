const Router = require('koa-router');

const router = new Router();// instanciar router
// definir como ordeno el login

router.get('/', async (ctx) => {
  ctx.response.body = 'Bienvenido';
});
router.get('/test', async (ctx) => {
  ctx.response.body = {
    message: 'Hello World!',
  };
});

module.exports = router;
