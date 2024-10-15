// importamos función scrape
const scrape = require('./scraping/script');

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

router.get('/scrape', async (ctx) => {
  try{
    const url = 'https://www.chiletrabajos.cl/encuentra-un-empleo';
    const jobs = await scrape(url);
    ctx.response.body = jobs;
  }
  catch(error){
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error during scraping',
    };
  }
});

module.exports = router;
