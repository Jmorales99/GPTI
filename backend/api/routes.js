const Router = require('koa-router');
const { generarCartaPresentacion } = require('../chat/prompt');
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
  const { nombre, telefono, correo, habilidades, experiencia, intereses, porque } = ctx.request.body;
  console.log({ nombre, telefono, correo, habilidades, experiencia, intereses, porque });
  const datosCandidato = {
    nombre,
    telefono,
    correo,
    habilidades,
    experiencia,
    intereses,
    porque,
  };

  const carta = await generarCartaPresentacion(datosCandidato);
  console.log(carta);
  ctx.response.body = {
    carta,
  };
});
module.exports = router;
