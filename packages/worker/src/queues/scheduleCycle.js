const dayjs = require('lib/dayjs');
const { isHoliday } = require('lib/helpers/holidays');
const Employee = require('lib/models/Employee');
const Employer = require('lib/models/Employer');
const Shift = require('lib/models/Shift');
const { getAvailabilityForRange } = require('lib/services/availability');
const { intersection } = require('lodash/intersection');
const { scheduleShifts } = require('../helpers/scheduleCycle');

// Converts weekly availability to a bitmap for a specific week.
function getWeeklyAvailability(employee, weekOf) {
  const override = employee.availability.scheduled.find((schedule) => dayjs(schedule.week_of).isSame(dayjs(weekOf), 'week'));
  return override?.availability || employee.availability.weekly;
}

module.exports = async function scheduleCycle(job) {
  console.log(`Scheduling cycle for employer ${job.id}`);

  try {
    const employer = await Employer.findById(job.id);

    // Get the first day of the cycle
    const cycleStartTime = employer.settings.last_cycle_end;
    const cycleLength = employer.settings.cycle_length;

    // Fetch employees and preprocess availability
    const employees = await Employee.find({ employer: employer.id }).map((employee) => ({
      ...employee,
      availability: Array.from({ length: cycleLength }, (_, i) => {
        const weekStart = dayjs(cycleStartTime).startOf('week').add(i, 'week');
        return getWeeklyAvailability(employee, weekStart);
      }).join(''),
    }));

    // Copy last cycle's shifts
    let shifts = Shift.find({
      employer: employer.id,
      start_time: {
        $gte: dayjs(employer.settings.last_cycle_end).subtract(employer.settings.cycle_length, 'week').toDate(),
        $lte: dayjs(employer.settings.last_cycle_end).toDate(),
      },
    }).map((shift) => ({
      ...shift,
      start_time: dayjs(shift.start_time).add(employer.settings.cycle_length, 'week').toDate(),
      end_time: dayjs(shift.end_time).add(employer.settings.cycle_length, 'week').toDate(),
      cancled: false,
    }));

    // Filter out impossible assignments
    shifts.forEach(async (shift) => {
      const employeeIsAvailable = await Promise.all(shift.employees.map(async (employeeId) => {
        const employee = await Employee.findById(employeeId);
        if (!employee) return false;
        if (!getAvailabilityForRange(employee.availability, shift.start_time, shift.end_time)) return false;
        return true;
      }));
      shift.employees = shift.employees.filter((_, index) => employeeIsAvailable[index]);
    });

    // Cancel shifts on assigned holidays
    if (employer.settings.holidays_off.length) shifts = shifts.filter((shift) => intersection(
      isHoliday(shift.start_time).map(({ id }) => id),
      employer.settings.holidays_off,
    ).length);

    // Generate shifts
    shifts = scheduleShifts(shifts, employees);

    // Create new shifts
    shifts.forEach(async (shift) => {
      await Shift.create({
        ...shift,
        employer: employer.id,
      });
    });
  } catch (err) {
    console.error(err);
  }
};
