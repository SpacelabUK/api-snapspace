
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

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.use(express.static(path.join(config.root)));

const port = (process.env.PORT || config.app.port);

app.listen(port);

console.log(`Snapspace app listening at ${port}`);

module.exports = app;
