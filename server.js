const Hapi = require('hapi');
const config = require('./lib/config');
const database = require('./lib/database');
const userRoutes = require('./routes/user.routes');

const server = new Hapi.Server();

server.connection({
  host: config.host,
  port: config.port
});

server.route(userRoutes);

server.start(err => {
  if (err) return console.error(err);

  console.log('Magic happens at', server.info.uri);

  database.connect(config.db_uri);
});
