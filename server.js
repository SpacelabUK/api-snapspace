
if (process.env.NODE_ENV !== 'production'|| process.env.NODE_ENV !== 'test') {
  require('dotenv').load();
}

const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  routes = require('./routes/routes'),
  bodyParser = require('body-parser'),
  config = require('./config.js').get(process.env.NODE_ENV),
  path = require('path');

mongoose.Promise = global.Promise;

mongoose.connect(config.database.uri);
mongoose.connection
  .once('open', () => { console.log("DB connection complete") })
  .on('error', (error) => {
    console.log(error);
  });

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use('/', routes);

app.use(express.static(path.join(config.root)));

app.listen(process.env.PORT || config.app.port);

console.log('Snapspace app listening');

module.exports = app;