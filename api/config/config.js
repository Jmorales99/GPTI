const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.POSTGRES_DB}`,
    host: 'postgres',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.POSTGRES_DB}`,
    host: 'postgres',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.POSTGRES_DB}`,
    host: 'postgres',
    dialect: 'postgres',
  },
};
