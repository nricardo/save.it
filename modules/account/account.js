
// -- load dependencies
var path = require('path');
var mongoose = require('mongoose');
var Account = mongoose.Schema('Account', require('./schema'));

module.exports = function (app, opts) {

  // -- get the helpers
  var templr = opts.helpers.templr;
  var partlr = opts.helpers.partlr;

  // -- module's middleware
  app.get('/accounts/:id', function (req, res, next) {
    var account = {};
    res.render(templr('account'), { account: account });
  });

  app.get('/accounts', function (req, res, next) {
    // -- set template title
    app.locals.title = 'Accounts';

    // -- gain access to db
    var db = req.db;

    // -- read accounts info
    var accounts = {};//req.db.accounts.find() || {};

    // -- register partials
    partlr('form');

    // -- render template
    res.render(templr('accounts'), { accounts: accounts });
  });
}