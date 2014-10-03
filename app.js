
"use strict";

// -- load dependencies
var express = require('express');

var init = require('./init');

// -- initialize application
var app = init(express);

// -- load application modules
app.load('home');
app.load('account');

// -- default routes (error handler's)
app.use(function(err, req, res, next) {
  // -- set title
  app.locals.title = "Error!";
  // -- render error (500) page
  res.status = '500';
  res.render(res.status, { message: err });
  app.logger.error(err);
});

app.use(function(req, res, next) {
  // -- set title
  app.locals.title = "Not Found!";
  // -- render 'Not found' (404) page
  res.status = '404';
  res.render(res.status, { message: 'No action defined for route: ' + req.url });
  app.logger.warn('Action "%s" not found! Check your routing scheme.', req.url);
});

// -- start application
app.listen(app.port, function() {
  app.logger.info('up and running (pid: %s) - listening on port %s', process.pid, app.port);
});

module.exports = app;