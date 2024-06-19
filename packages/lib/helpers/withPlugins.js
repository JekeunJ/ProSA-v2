module.exports = (plugins, config) => plugins.reduce((c, plugin) => {
  if (Array.isArray(plugin)) return plugin[0](c, ...plugin.slice(1));
  return plugin(c);
}, config);
