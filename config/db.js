
// -- load dependencies
var mongoose = require('mongoose');

// -- setup DB access and hook to it
// -- we'll use MongoDB throughout Mongoose ODM
module.exports = function (app, db) {
  // -- database full URI
  var uri = 'mongodb://' + db.host +  ':' + db.port + '/' + db.dbname;

  // -- try to connect
  mongoose.connect(uri, function (err) {
    // -- log in case of error
    if (err) app.logger.error('Could not connect to database... Please check your configurations or network connections!');

    // -- successfull connection ?
    app.logger.info('Connected to database: %s', uri);
  });
}