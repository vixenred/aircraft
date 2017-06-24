'use strict';

const EXPRESS_PORT = 80;
const port = process.env.PORT || EXPRESS_PORT;
const debug = require('debug')('slots:app');

debug('Application launched');

require('./globals');
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const api = require('./routes/api');

app.disable('etag');
app.set('port', port);

app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', api);

app.use(function (req, res, next)
{
    next(new NetworkError('Not Found', NetworkError.NOT_FOUND));
});

app.use(function (err, req, res)
{
    debug(err);
    res.status(err.status || NetworkError.INTERNAL_ERROR).end();
});

app.listen(port, function()
{
    debug('Listening on ' + port);
});
