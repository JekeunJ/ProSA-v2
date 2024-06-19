const omit = require('lodash/omit');

module.exports = function mongooseHidden(schema) {
  schema.set('toObject', {
    getters: true,
    virtuals: true,
    transform: (doc, obj) => omit(obj, ['__v', '_id']),
  });

  schema.set('toJSON', {
    getters: true,
    virtuals: true,
    transform: (doc, obj) => omit(obj, ['__v', '_id']),
  });
};
