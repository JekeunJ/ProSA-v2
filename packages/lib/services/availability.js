const dayjs = require('../dayjs');

// Default availability for new employees
module.exports.nineToFive = (() => {
  const weekend = '0'.repeat(24 * 12); // Weekends free
  const weekday = '0'.repeat(9 * 12) + '1'.repeat(8 * 12) + '0'.repeat(7 * 12);

  return weekend + weekday.repeat(5) + weekend;
})();

// Converts a bitmap string to an array of 1s and 0s
module.exports.bitmapStringToArray = function bitmapStringToArray(bitmapString) {
  return bitmapString.split('').map((bit) => parseInt(bit, 10));
};

// Converts an array of 1s and 0s to a bitmap string
module.exports.bitmapArrayToString = function bitmapArrayToString(bitmapArray) {
  return bitmapArray.join('');
};

// Checks if a string is a valid bitmap (only contains 1s and 0s and has a valid length)
module.exports.isValidBitmap = function isValidBitmap(bitmapString, expectedLength = 2016) {
  return /^[01]+$/.test(bitmapString) && bitmapString.length === expectedLength;
};

// Converts a time range to bitmap intervals based on a 5-minute resolution
module.exports.timeRangeToIntervals = function timeRangeToIntervals(time, startTime, endTime) {
  const startOfWeek = dayjs(startTime).startOf('week');
  const startInterval = Math.floor(startTime.diff(startOfWeek, 'minute') / 5);
  const endInterval = Math.ceil(endTime.diff(startOfWeek, 'minute') / 5);
  const intervals = [];
  for (let i = startInterval; i < endInterval; i++) {
    intervals.push(i);
  }
  return intervals;
};

// Gets availability for a range of intervals from a bitmap string
module.exports.getAvailabilityForRange = function getAvailabilityForRange(bitmapString, startTime, endTime) {
  if (!module.exports.isValidBitmap(bitmapString)) throw new Error('Invalid bitmap string');

  const bitmapArray = module.exports.bitmapStringToArray(bitmapString);
  const intervals = module.exports.timeRangeToIntervals(startTime, endTime);
  return intervals.every((interval) => bitmapArray[interval] === 1);
};

// Sets availability for a range of intervals in a bitmap string
module.exports.setAvailabilityForRange = function setAvailabilityForRange(bitmapString, startTime, endTime, availability) {
  if (!module.exports.isValidBitmap(bitmapString)) throw new Error('Invalid bitmap string');

  const bitmapArray = module.exports.bitmapStringToArray(bitmapString);
  const intervals = module.exports.timeRangeToIntervals(startTime, endTime);
  intervals.forEach((interval) => {
    bitmapArray[interval] = availability ? 1 : 0;
  });
  return module.exports.bitmapArrayToString(bitmapArray);
};
