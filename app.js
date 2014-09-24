
"use strict";

// -- load express
var express = require('express');

// -- bootstrap application
var app = require('./config/bootstrap')(express);

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
  console.error(err);
});

app.use(function(req, res, next) {
  // -- set title
  app.locals.title = "Not Found!";
  // -- render 'Not found' (404) page
  res.status = '404';
  res.render(res.status, { message: 'No action defined for route: ' + req.url });
  console.error('Action "%s" not found! Check your routing scheme.', req.url);
});

// -- start application
app.listen(app.get('port'), function() { console.log('Express server listening on port %s.', app.get('port')); });

module.exports = app;