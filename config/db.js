
// -- load dependencies
var mongoose = require('mongoose');

// -- setup DB access and hook to it
// -- we'll use MongoDB throughout Mongoose ODM
module.exports = function (app, config) {
  // -- database full URI
  var dburi = 'mongodb://' + config.DB.host +  ':' + config.DB.port + '/' + config.DB.dbname;

  // -- try to connect
  var con = mongoose.connect(dburi);
  var db  = mongoose.connection;

  // -- check connection status
  // - in case of an error
  db.on('error', function (err) {
    console.error(err);
  });
  // - in case we connected successfully
  db.on('connected', function () {
    console.log('Connected to:', dburi);
    // -- hook db to incoming requests
    app.use(function (req, res, next) {
      req.db = db;
      next();
    });
  });

  return db;
}