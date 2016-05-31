const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8000,
  db_uri: process.env.DB_URI || 'mongodb://localhost/hapi',
};

module.exports = config;
