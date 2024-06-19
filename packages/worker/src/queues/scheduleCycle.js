const dayjs = require('lib/dayjs');
const Employee = require('lib/models/Employee');
const Employer = require('lib/models/Employer');
const Shift = require('lib/models/Shift');

module.exports = async function scheduleCycle(job) {
  console.log(`Scheduling cycle for employer ${job.id}`);

  try {
    const employer = await Employer.findById(job.id);
    const employees = await Employee.find({ employer: employer.id });

    // Get the first day of the cycle
    const cycleStart = employer.settings.last_cycle_end;
  } catch (err) {
    console.error(err);
  }
};
