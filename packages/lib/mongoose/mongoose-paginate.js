const omit = require('lodash/omit');

module.exports = function mongoosePaginate(schema) {
  schema.statics.paginate = function paginate(query = {}, options) {
    options = {
      projection: {},
      sort: { created: -1 },
      select: '',
      ...options,
    };

    if (query.limit) options.limit = query.limit;
    if (query.page) options.page = query.page;
    if (query.sort) options.sort = typeof query.sort === 'string' ? JSON.parse(query.sort) : query.sort;
    if (query.sort_field) options.sort = { [`${query.sort_field}`]: query.sort_direction || -1 };
    if (query.expand) options.expand = query.expand;

    query = omit(query, ['page', 'limit', 'sort', 'sort_field', 'sort_direction', 'expand']);

    const limit = +options.limit > 0 ? (+options.limit <= 100 ? +options.limit : 100) : 20;
    const page = +options.page > 0 ? +options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(query).exec();
    const result = this.find(query, options.projection);

    if (options.expand) result.populate(options.expand);

    const docsPromise = result.select(options.select)
      .skip(skip)
      .limit(limit)
      .sort(options.sort)
      .exec();

    return Promise.all([countPromise, docsPromise])
      .then((values) => {
        const [total, docs] = values;
        const meta = { total, page };

        const pages = limit > 0 ? Math.ceil(total / limit) || 1 : null;
        meta.has_more = page < pages;

        const result = {
          data: docs,
          ...meta,
        };

        return Promise.resolve(result);
      }).catch((error) => Promise.reject(error));
  };
};
