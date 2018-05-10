
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const config = require('./config.js').get(process.env.NODE_ENV);
const path = require('path');

const app = express();
mongoose.Promise = global.Promise;

mongoose.connect(config.database.uri);
mongoose.connection
  .once('open', () => { console.log('DB connection complete'); })
  .on('error', (error) => {
    console.log(error);
  });

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

app.use('/', routes);

app.use(express.static(path.join(config.root)));

app.listen(process.env.PORT || config.app.port);

console.log('Snapspace app listening');

module.exports = app;
