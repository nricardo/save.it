
// -- load dependencies
var fs   = require('fs');
var path = require('path');
var hbs  = require('hbs');
//var favicon = require('static-favicon');
//var logger = require('morgan');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');

module.exports = function (express) {

  // -- global site settings
  var config = require('./config');

  // -- startup application
  var app = express();

  // -- setup app middleware
  //app.use(favicon());
  //app.use(logger('dev'));
  //app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(config.PATHS.web));

  // -- setup server port
  app.set('port', config.PORT);

  // -- setup DB access
  var db = require('./db')(app, config);

  // -- setup templates engine and layouts
  app.set('view engine', 'html');
  app.set('views', config.PATHS.views);
  app.engine('html', hbs.__express);

  // -- middleware function that loads modules
  app.load = function (name, options) {
    // -- parse options
    options = options || {};

    // -- define module's properties
    var module = {
      names:  ['index.js', name+'.js'],
      path:   path.join(config.PATHS.modules, name),
      views:  path.relative(config.PATHS.views, path.join(config.PATHS.modules, name))
    }

    // -- inject helper functions into options
    options.helpers = {
      templr: function (views) {
        return function (template) { return path.join(views, template); }
      }(module.views),

      partlr: function (handler, views) {
        return function (template) {
          var file  = path.join(views, '_' + template + '.html');
          handler.registerPartial(template, fs.readFileSync(file).toString());
        }
      }(hbs, module.path)
    }

    // -- search module's js script
    var script = module.names.filter(function (name) {
      name = path.join(module.path, name);
      return fs.existsSync(name);
    });

    // -- normalize to full pathname
    script = path.join(module.path, script.toString());

    // -- load the script
    module = require(script);

    // -- call module's
    console.log(' # loading module: %s...', name);
    module(app, options);
  }

  // -- static template data
  app.locals.site =
  {
    name: "Sav€.IT!",

    author: {
      name:   "Nelson Ricardo",
      email:  "nelson.s.ricardo@gmail.com"
    }
  }

  app.locals.site.copyright = app.locals.site.name + ' @ ' + new Date().getFullYear();

  // -- apply configuration
  app.config = config;

  return app;
}