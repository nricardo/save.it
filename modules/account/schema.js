
// -- load dependencies
var mongoose = require('mongoose');

module.exports = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  desc: { type: String },
  balance: { type: Number, default: 0 }
})