const DateHolidays = require('date-holidays');
const slugify = require('slugify');

const _addID = (holiday) => ({ ...holiday, id: slugify(holiday.name, { lower: true, strict: true }) });

module.exports.holidays = (new DateHolidays()).getHolidays().map(_addID);

module.exports.isHoliday = function isHoliday(date) {
  return (new DateHolidays()).isHoliday(date).map(_addID);
};

module.exports.getHolidays = function getHolidays(...params) {
  return (new DateHolidays(...params)).getHolidays().map(_addID);
};
