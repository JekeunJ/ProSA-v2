const dayjs = require('dayjs');
const Duration = require('dayjs/plugin/duration');
const LocalizedFormat = require('dayjs/plugin/localizedFormat');
const RelativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(RelativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(Duration);

module.exports = dayjs;
