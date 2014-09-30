
// -- load dependencies
var path = require('path');
var mongoose = require('mongoose');

module.exports = function (app, opts) {

  // -- get the helpers
  var templr = opts.helpers.templr;
  var partlr = opts.helpers.partlr;

  // -- make account model available
  var Account = mongoose.model('Account', require('./schema'));

  // -- module's middleware
  app.get('/accounts/:id', function (req, res, next) {
    console.log(req.params)

    // -- get account
    //var account = Account.findOne(req.params.id) || null;

    res.render(templr('account'), { account: null });
  });

  app.get('/accounts', function (req, res, next) {
    // -- register partials
    partlr('form');

    // -- read accounts info
    Account.find({}, function (err, accounts) {
      if (err) next(err);

      // -- render template
      app.locals.title = 'Accounts';
      res.render(templr('accounts'), { accounts: accounts });
    });
  });

  app.post('/accounts', function (req, res, next) {
    console.log(req)

    // -- create new account
    var account = new Account({
      name: 'xpto',
      type: 'A',
      desc: 'Just a test...',
      balance: 250
    });

    // -- save account into database
    account.save(function (err, data) {
      if (err) next(err);
      console.log(data)
    });

    // -- redirect
    res.redirect('/accounts');
  });
}