
// -- load dependencies
var path = require('path');

module.exports = {

  // application config
  site: {
    name: "Sav€.IT",
    author: {
      name:   "Nelson Ricardo",
      email:  "nelson.s.ricardo@gmail.com"
    }
  },

  // HTTP server port
  port: process.env.PORT || 8000,

  // Log path
  logfile: 'logs/app.log',

  // DB server config
  db: {
    host:   'localhost',  // -- DB host machine
    port:   '27017',      // -- DB listening port
    dbname: 'saveit',     // -- DB name to be used
    user:   '',
    pass:   ''
  },

  // application paths
  paths: {
    web:        path.normalize(path.join(__dirname, '../web')),
    lib:        path.normalize(path.join(__dirname, '../lib')),
    views:      path.normalize(path.join(__dirname, '../layouts')),
    modules:    path.normalize(path.join(__dirname, '../modules'))
  }
}