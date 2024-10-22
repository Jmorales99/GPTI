const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.POSTGRES_DB}`,
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.POSTGRES_DB}`,
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.POSTGRES_DB}`,
    host: 'localhost',
    dialect: 'postgres',
  },
};
