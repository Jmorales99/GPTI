
const Router = require('koa-router');
const router = new Router();

const { Job } = require('./models');

router.get('/', async (ctx) => {
  ctx.response.body = 'Bienvenido';
});
router.get('/test', async (ctx) => {
  ctx.response.body = {
    message: 'Hello World!',
  };
});

router.post('/jobs', async (ctx) => {
  try {
    const { category, jobs } = ctx.request.body;
    console.log(`Received ${jobs.length} jobs for category ${category}`);
    ctx.response.body = {
      message: 'Jobs received',
    };
    jobs.forEach(async (job) => {
      try {
        const [newJob, created] = await Job.findOrCreate({
          where: { link: job.link },
          defaults: job,
        });
        if (!created) {
          await Job.update(job, {
            where: { link: job.link },
          });
        }
      } catch (error) {
        console.error(`Error adding job to the database: ${error.message}`);
      }
    });
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error receiving jobs',
    };
  }
});

module.exports = router;
