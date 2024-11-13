
const Router = require('koa-router');
const router = new Router();
const Sequelize = require('sequelize');
// const { Job } = require('./models');
// const { REAL } = require('sequelize');

router.get('/', async (ctx) => {
  ctx.response.body = 'Bienvenido';
});
router.get('/test', async (ctx) => {
  ctx.response.body = {
    message: 'Hello World!',
  };
});

// router.post('/jobs', async (ctx) => {
//   try {
//     const { category, jobs } = ctx.request.body;
//     console.log(`Received ${jobs.length} jobs for category ${category}`);
//     ctx.response.body = {
//       message: 'Jobs received',
//     };
//     jobs.forEach(async (job) => {
//       try {
//         const [newJob, created] = await Job.findOrCreate({
//           where: { link: job.link },
//           defaults: job,
//         });
//         if (!created) {
//           await Job.update(job, {
//             where: { link: job.link },
//           });
//         }
//       } catch (error) {
//         console.error(`Error adding job to the database: ${error.message}`);
//       }
//     });
//   } catch (error) {
//     ctx.response.status = 500;
//     ctx.response.body = {
//       message: error.message,
//       error: 'Error receiving jobs',
//     };
//   }
// });
router.post('/jobs/addtest', async (ctx) => {
  console.log(ctx.request.body);
})
router.post('/jobs/add' , async (ctx) => {
  const data = ctx.request.body;
  // console.log(`Received ${jobs.length} jobs for category ${ctx.request.body.category}`);
  
  try {
    console.log(data.link);
    const job = await ctx.orm.Job.findAll({
      where: { link: data.link },
    });
    console.log(data);
    if (job.length > 0) {
      await ctx.orm.Job.update(data, {
        where: { link: data.link },
      });
      console.log('Job updated');
    } else{
      console.log(data);
      await ctx.orm.Job.create({
        title: data.title,
        company: data.company,
        city: data.city,
        link: data.link,
        category: data.category,
        description: data.description,
      });
    }
  } catch (error) {
    console.error(`Error adding job to the database: ${error.message}`);
    ctx.response.status = 500;
    ctx.response.body = {
      message: error.message,
      error: 'Error adding job',
    };
    return
  }
  
    ctx.response.body = {
      message: 'Jobs received',
    };
    ctx.response.status = 201;
});
router.get('/jobs', async (ctx) => {
  try {
    queryParams = ctx.request.query;
    const page = parseInt(queryParams.page, 10) || 1; // Número de página (1 por defecto)
    const pageSize = parseInt(queryParams.pageSize, 10) || 10; // Tamaño de página (10 por defecto)
    
    const data = {
      ...(queryParams.city !== undefined && { city: queryParams.city }),
      ...(queryParams.category !== undefined && { category: queryParams.category })
    };
    // 1. Contar el total de trabajos que cumplen con los filtros
    const totalJobs = await ctx.orm.Job.count({
      where: data,
    });

    // 2. Calcular el número de páginas
    const totalPages = Math.ceil(totalJobs / pageSize);

    // 3. Obtener los trabajos para la página actual
    const jobs = await ctx.orm.Job.findAll({
      where: data,
      order: [['createdAt', 'DESC']], // Orden descendente
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 4. Devolver los trabajos con información de paginación
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
module.exports = router;
