const Router = require('koa-router');
const { obtener_recomendaciones } = require('../chat/prompt');
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
router.post('/recomendaciones', async (ctx) => {
  const { aptitudes } = ctx.request.body;
  console.log(aptitudes);
  const recomendaciones = await obtener_recomendaciones(aptitudes);
  console.log(recomendaciones);
  ctx.response.body = {
    recomendaciones,
  };
});
module.exports = router;
