const mongoose = require('mongoose');

mongoose.plugin(require('mongoose-lean-virtuals'));
mongoose.plugin(require('mongoose-autopopulate'));
mongoose.plugin(require('./mongoose-expand'));
mongoose.plugin(require('./mongoose-hidden'));
mongoose.plugin(require('./mongoose-paginate'));

module.exports = mongoose;
