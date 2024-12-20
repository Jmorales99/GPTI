const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const orm = require('./models');

const PORT = process.env.PORT || 3000;

orm.sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection to the database has been established successfully.');
    await orm.sequelize.sync();
    app.listen(PORT, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return app;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
