require("dotenv").config();
const pg = require("pg")
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'postgres',
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg
  },
};