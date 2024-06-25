const { InvalidRequestError } = require('../helpers/Error');

module.exports = function mongooseExpand(schema) {
  const paths = Object.entries(schema.paths)
    .filter(([, { options, caster }]) => options.expandable || caster?.options?.expandable)
    .map(([path]) => path)
    .concat(Object.entries(schema.virtuals) // Include any lookup virtuals
      .filter(([, { options }]) => options.ref)
      .map(([path]) => path));

  schema.pre(['find', 'findById', 'findOne'], function () {
    let { expand } = this.getQuery();
    if (expand === undefined) return;

    if (typeof expand === 'string' || expand instanceof String) expand = expand.split(/[\s,]+/);

    if (!Array.isArray(expand)) throw new InvalidRequestError({
      param: 'expand',
      message: 'Invalid array',
    });

    expand.forEach((path) => {
      if (!paths.includes(path)) throw new InvalidRequestError({
        message: `This property cannot be expanded (${path}).`,
      });
    });

    this.populate(expand);
    this.setQuery({ ...this.getQuery(), expand: undefined });
  });
};
