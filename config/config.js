
// -- load dependencies
var path = require('path');

module.exports = {

  // HTTP server port
  PORT: process.env.PORT || 8000,

  // DB server config
  DB: {
    host:   'localhost',  // -- DB host machine
    port:   '27017',      // -- DB listening port
    dbname: 'saveit',     // -- DB name to be used
    user:   '',
    pass:   ''
  },

  // application paths
  PATHS: {
    web:        path.normalize(path.join(__dirname, '../web')),
    lib:        path.normalize(path.join(__dirname, '../lib')),
    views:      path.normalize(path.join(__dirname, '../layouts')),
    modules:    path.normalize(path.join(__dirname, '../modules'))
  }
}