
const Router = require('koa-router');
const router = new Router();
const Sequelize = require('sequelize');
const { generarCartaPresentacion } = require('./chat/prompt');

router.get('/', async (ctx) => {
  ctx.response.body = 'Bienvenido';
});

router.post('/jobs/add', async (ctx) => {
  const data = ctx.request.body;

  if (!data || !Array.isArray(data.jobs)) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: 'No job data provided or data is not an array',
    };
    return;
  }

  const category = data.category || '';

  try {
    for (const job of data.jobs) {
      const jobData = {
        title: job.title || '',
        company: job.company || '',
        city: job.city || '',
        link: job.link || '',
        category: category,
        description: job.description || '',
      };

      const existingJob = await ctx.orm.Job.findAll({
        where: { link: jobData.link },
      });

      if (existingJob.length > 0) {
        await ctx.orm.Job.update(jobData, {
          where: { link: jobData.link },
        });
        console.log(`Job updated: ${jobData.link}`);
      } else {
        await ctx.orm.Job.create(jobData);
        console.log(`Job created: ${jobData.link}`);
      }
    }
  } catch (error) {
    console.error(`Error adding jobs to the database: ${error.message}`);
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error adding jobs',
    };
    return;
  }

  ctx.response.body = {
    message: 'Jobs received',
  };
  ctx.response.status = 201;
});
router.get('/jobs', async (ctx) => {
  try {
    queryParams = ctx.request.query;
    const page = parseInt(queryParams.page, 10) || 1;
    const pageSize = parseInt(queryParams.pageSize, 10) || 10;
    
    const data = {
      ...(queryParams.city !== undefined && { city: queryParams.city }),
      ...(queryParams.category !== undefined && { category: queryParams.category })
    };
    const totalJobs = await ctx.orm.Job.count({
      where: data,
    });

    const totalPages = Math.ceil(totalJobs / pageSize);

    const jobs = await ctx.orm.Job.findAll({
      where: data,
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    ctx.body = {
      jobs,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        pageSize: pageSize,
        totalJobs: totalJobs,
      },
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error retrieving jobs',
    };
  }
});

router.get('/jobs/:link', async (ctx) => {
  try {
    const job = await ctx.orm.Job.findAll({
      where: { link: ctx.params.link },
    });
    if (job.length == 1) {
      ctx.response.body = job;
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: 'Job not found',
      };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error retrieving job',
    };
  }
});

router.get('/cities', async (ctx) => {
  try {
    const uniqueCities = await ctx.orm.Job.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city']],
      raw: true,
    });
    ctx.body = uniqueCities.map((city) => city.city);
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error retrieving cities',
    };
  }
});
router.get('/categories', async (ctx) => {
  try {
    const uniqueCategories = await ctx.orm.Job.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
      raw: true,
    });
    ctx.body = uniqueCategories.map((category) => category.category);
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error retrieving cities',
    };
  }
});

router.post('/recomendaciones', async (ctx) => {
  const { nombre, telefono, correo, habilidades, experiencia, intereses, porque, oferta } = ctx.request.body;
  console.log({ nombre, telefono, correo, habilidades, experiencia, intereses, porque, oferta });
  const datosCandidato = {
    nombre,
    telefono,
    correo,
    habilidades,
    experiencia,
    intereses,
    porque,
    oferta,
  };
  const carta = await generarCartaPresentacion(datosCandidato);
  ctx.response.body = {
    carta,
  };
});

module.exports = router;
