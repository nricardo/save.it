
// -- load dependencies
var fs   = require('fs');
var path = require('path');
var hbs  = require('hbs');
var logger = require('morgan');
var winston = require('winston');
var parser = require('body-parser');

var settings = require('./config/settings');

module.exports = function (express) {

  // -- startup application
  var app = express();

  // -- application logger
  app.logger = new winston.Logger({
    transports: [
      new (winston.transports.Console)({ colorize: true, timestamp: true }),
      new (winston.transports.File)({ level: 'error', filename: 'logs/app.log', timestamp: true })
    ]
  });

  // -- modules loader
  app.load = function (name, options) {
    // -- parse options
    options = options || {};

    // -- define module's properties
    var module = {
      names:  ['index.js', name+'.js'],
      path:   path.join(app.paths.modules, name),
      views:  path.relative(app.paths.views, path.join(app.paths.modules, name))
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
    app.logger.info('loading module: %s...', name);
    module(app, options);
  }

  // -- configurator
  app.configurator = function (obj, settings) {
    app.logger.info('loading application configuration...');
    for (var conf in settings) {
      app.logger.info(' - applying setting: %s', conf);
      obj[conf] = settings[conf];
    }
  }

  // -- apply configurations
  app.configurator(settings);

  // -- app middleware
  app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));
  app.use(express.static(app.paths.web));

  // -- setup templates engine and layouts
  app.set('view engine', 'html');
  app.set('views', app.paths.views);
  app.engine('html', hbs.__express);

  return app;
}