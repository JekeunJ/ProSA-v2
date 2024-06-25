const fs = require('fs/promises');
const Handlebars = require('handlebars');
const path = require('path');

const templateCache = {};

module.exports = async function compileTemplate(template, context) {
  const compiled = templateCache[template] || Handlebars.compile((await fs.readFile(path.join(__dirname, `../templates/${template}.hbs`))).toString());
  if (!templateCache[template]) templateCache[template] = compiled;

  return compiled(context);
};
