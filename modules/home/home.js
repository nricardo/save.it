
// -- load dependencies
var path = require('path');

module.exports = function (app, opts) {

  // -- get the helpers
  var templr = opts.helpers.templr;
  var partlr = opts.helpers.partlr;

  // -- module's middleware
  app.get('/', function (req, res, next) {
    app.locals.title = 'Welcome';
    res.render(templr('welcome'));
  });

  app.get('/dashboard', function (req, res, next) {
    app.locals.title = 'Dashboard';
    res.render(templr('dashboard'));
  });

  app.get('/about', function (req, res, next) {
    app.locals.title = 'About';
    res.render(templr('about'));
  });
}