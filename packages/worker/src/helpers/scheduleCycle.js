/* eslint-disable no-loop-func */
/* eslint-disable no-continue */
const dayjs = require('lib/dayjs');
const { intersection } = require('lodash/intersection');
const { union } = require('lodash/union');
const { xor } = require('lodash/xor');

// Gets the intervals for a shift.
function getIntervalsForShift({ start_time: startTime, end_time: endTime }) {
  const startInterval = Math.floor(dayjs(startTime).diff(dayjs().startOf('week'), 'minute') / 5);
  const endInterval = Math.floor(dayjs(endTime).diff(dayjs().startOf('week'), 'minute') / 5);
  return Array.from({ length: endInterval - startInterval }, (_, i) => startInterval + i);
}

// Calculates the weight of an employee for a shift, factoring in consistency and hours.
function calculateWeight(employee, shift) {
  const shiftIntervals = getIntervalsForShift(shift);
  const intervalsAssigned = shiftIntervals.filter((interval) => employee.assigned[interval]).length;
  const consistencyFactor = intervalsAssigned / shiftIntervals.length;
  const hoursFactor = 1 / Math.min(1, employee.hours);

  return consistencyFactor * hoursFactor;
}

// Calculates partial weight for partially available employees.
function calculatePartialWeight(employee, shift) {
  const shiftIntervals = getIntervalsForShift(shift);
  const intervalsAvailable = shiftIntervals.filter((interval) => employee.availability[interval] && !employee.assigned[interval]).length;
  const availabilityFactor = intervalsAvailable / shiftIntervals.length;
  return calculateWeight(employee, shift) * availabilityFactor;
}

// Filters and sorts possible employees for a shift.
function getPossibleEmployeesForShift(shift, employees) {
  const shiftIntervals = getIntervalsForShift(shift);
  const possibleEmployees = employees.filter((employee) => shiftIntervals.every((interval) => employee.availability[interval] && !employee.assigned[interval]));

  return possibleEmployees.sort((a, b) => calculateWeight(b, shift) - calculateWeight(a, shift));
}

// Filters and sorts partially available employees for a shift.
function getPartiallyAvailableEmployeesForShift(shift, employees) {
  const shiftIntervals = getIntervalsForShift(shift);
  const possibleEmployees = employees.filter((employee) => shiftIntervals.some((interval) => employee.availability[interval] && !employee.assigned[interval]));

  return possibleEmployees.sort((a, b) => calculatePartialWeight(b, shift) - calculatePartialWeight(a, shift));
}

// Finds the shift with the fewest possible employees.
function findShiftWithFewestPossibilities(shifts, employees) {
  return shifts.reduce((minShift, shift) => {
    const possibilities = getPossibleEmployeesForShift(shift, employees).length;
    const ratio = possibilities / (shift.min_employees - shift.employees.length || 1);
    if (!minShift || ratio < minShift.ratio || (ratio === minShift.ratio && shift.split_depth < minShift.shift.split_depth)) {
      return { shift, ratio };
    }
    return minShift;
  }, null).shift;
}

function calculateVacancies(shifts) {
  return shifts.reduce((vacancies, shift) => vacancies + Math.max(0, shift.min_employees - shift.employees.length), 0);
}

// Adds extra employees to shifts if below max_employees.
function addExcessEmployees(shifts, employees) {
  let allSameHours = employees.every((e) => e.hours === employees[0].hours);

  while (!allSameHours) {
    const employee = employees.sort((a, b) => a.hours - b.hours)[0];

    const validShifts = shifts.filter((shift) => shift.employees.length < (shift.max_employees || Math.ceil(shift.min_employees * 1.5))
          && getIntervalsForShift(shift).every((interval) => employee.availability[interval] && !employee.assigned[interval]));

    if (validShifts.length === 0) {
      employees.splice(employees.indexOf(employee), 1);
      if (employees.length === 0) break;
      continue;
    }

    // eslint-disable-next-line no-loop-func
    const shift = validShifts.sort((a, b) => calculateWeight(b, employee) - calculateWeight(a, employee))[0];

    const updatedShifts = shifts.map((s) => (s === shift ? { ...s, employees: [...s.employees, employee.id] } : s));

    const updatedEmployees = employees.map((e) => (e === employee ? {
      ...e,
      hours: e.hours + dayjs.duration(dayjs(shift.end_time).diff(dayjs(shift.start_time))).asHours(),
      assigned: (() => {
        const newAssigned = [...e.assigned];
        const intervals = getIntervalsForShift(shift);
        intervals.forEach((interval) => { newAssigned[interval] = 1; });
        return newAssigned;
      })(),
    } : e));

    shifts = updatedShifts;
    employees = updatedEmployees;

    allSameHours = employees.every((e) => e.hours === employees[0].hours);
  }
  return shifts;
}

function splitShiftIntoSegments(shift, employees, minShiftDuration) {
  const shiftStart = dayjs(shift.start_time);
  const shiftEnd = dayjs(shift.end_time);
  const shiftIntervals = getIntervalsForShift(shift);

  // Step 1: Identify available intervals for each employee
  const availableIntervals = employees.flatMap((employee) => {
    const intervals = shiftIntervals
      .filter((interval) => employee.availability[interval] && !employee.assigned[interval])
      .reduce((acc, interval) => {
        if (acc.length === 0) return [[interval]];

        const lastSequence = acc[acc.length - 1];
        const lastInterval = lastSequence[lastSequence.length - 1];

        if (interval === lastInterval + 1) lastSequence.push(interval);
        else acc.push([interval]);

        return acc;
      }, []);

    return intervals.map((interval) => ({
      employee,
      start: shiftStart.add(interval[0] * 5 - shiftIntervals[0], 'minute'),
      end: shiftStart.add(interval[interval.length - 1] * 5 - shiftIntervals[0], 'minute'),
    }));
  });

  // Step 2: Trim the edges of the intervals if necessary
  const trimmedIntervals = availableIntervals.map(({ employee, start, end }) => {
    const startDiff = start.diff(shiftStart, 'minute');
    const endDiff = shiftEnd.diff(end, 'minute');

    if (startDiff < minShiftDuration.asMinutes()) {
      start = shiftStart.add(minShiftDuration);
    }

    if (endDiff < minShiftDuration.asMinutes()) {
      end = shiftEnd.subtract(minShiftDuration);
    }

    return { employee, start, end };
  }).filter(({ start, end }) => start < end); // make sure boundaries still make sense lol

  // Step 3: Convert to distinct non-overlapping time segments
  let timeSegments = shiftIntervals.reduce((acc, interval) => {
    const startTime = shiftStart.add((interval - shiftIntervals[0]) * 5, 'minute');
    const endTime = startTime.add(5, 'minute');

    const availableEmployees = trimmedIntervals
      .filter(({ start, end }) => getIntervalsForShift({ start_time: start, end_time: end }).includes(interval))
      .reduce((acc, { employee }) => [...acc, employee], []);

    const lastSegment = acc[acc.length - 1];

    // If there's a change, add a new segment
    if (xor(lastSegment.employees, availableEmployees).length) {
      return [...acc, { start: startTime, end: endTime, employees: availableEmployees }];
    }

    // No change, extend the end time and return
    lastSegment.end = endTime;
    return acc;
  }, []);

  // Step 3.5: Add start and end time segments if necessary
  if (timeSegments[0].start !== shiftStart) {
    timeSegments.splice(0, 0, { start: shiftStart, end: timeSegments[0].start, employees: [] });
  }

  if (timeSegments[timeSegments.length - 1].end !== shiftEnd) {
    timeSegments.push({ start: timeSegments[timeSegments.length - 1].end, end: shiftEnd, employees: [] });
  }

  function calculateMergeWeight(s1, s2) {
    const employeesBefore = union(s1.employees, s2.employees);
    const employeesAfter = intersection(s1.employees, s2.employees);

    const employeesFactor = employeesAfter.length / employeesBefore.length;
    const employeeWeightFactor = employeesAfter.reduce((sum, employee) => sum + calculatePartialWeight(employee, { start_time: s1.start, end_time: s2.end }), 0);
    return employeesFactor * employeeWeightFactor;
  }

  function mergeSegments(s1, s2) {
    return {
      start: s1.start,
      end: s2.end,
      employees: intersection(s1, s2),
    };
  }

  // Step 4: Merge small segments until all meet minimum duration
  while (timeSegments.some((segment) => segment.end.diff(segment.start, 'minute') < minShiftDuration.asMinutes())) {
    const smallestSegmentIndex = timeSegments.reduce((smallestIndex, segment, index, arr) => {
      if (smallestIndex === -1 || segment.end.diff(segment.start, 'minute') < arr[smallestIndex].end.diff(arr[smallestIndex].start, 'minute')) return index;
      return smallestIndex;
    }, -1);

    const smallestSegment = timeSegments[smallestSegmentIndex];
    const prevSegment = smallestSegmentIndex > 0 && timeSegments[smallestSegmentIndex - 1];
    const nextSegment = smallestSegmentIndex < timeSegments.length - 1 && timeSegments[smallestSegmentIndex + 1];

    const prevMergeWeight = prevSegment ? calculateMergeWeight(prevSegment, smallestSegment) : 0;

    const nextMergeWeight = nextSegment ? calculateMergeWeight(smallestSegment, nextSegment) : 0;

    const newSegment = mergeSegments(
      prevMergeWeight > nextMergeWeight ? prevSegment : smallestSegment,
      prevMergeWeight > nextMergeWeight ? smallestSegment : nextSegment,
    );

    timeSegments.splice(
      prevMergeWeight > nextMergeWeight ? smallestSegmentIndex - 1 : smallestSegmentIndex,
      2,
      newSegment,
    );
  }

  // Step 5: Merge adjacent segments with the same employees
  timeSegments = timeSegments.reduce((acc, segment) => {
    if (!acc.length) return [segment];

    const lastSegment = acc[acc.length - 1];
    if (!xor(lastSegment.employees, segment.employees).length) {
      lastSegment.end = segment.end;
      return acc;
    }

    return [...acc, segment];
  }, []);

  // Step 6: Create new shifts from the final segments
  return timeSegments.map((segment) => ({
    ...shift,
    start_time: segment.start.toDate(),
    end_time: segment.end.toDate(),
    employees: segment.employees,
    split_depth: (shift.split_depth || 0) + 1,
  }));
}

module.exports.scheduleShifts = function scheduleShifts(shifts, employees, {
  minShiftDuration,
  enableShiftSplitting = true,
  addExcess = true,
}) {
  let bestSchedule = null;
  if (!minShiftDuration) minShiftDuration = dayjs.duration(Math.min(...shifts.map((shift) => dayjs(shift.end_time).diff(dayjs(shift.start_time)))) / 2);

  function generateSchedule(shifts, employees) {
    // Success case!
    if (shifts.every((shift) => shift.employees.length >= shift.min_employees)) {
      bestSchedule = shifts;
      return shifts;
    }

    const criticalShift = findShiftWithFewestPossibilities(shifts, employees);
    const possibilities = getPossibleEmployeesForShift(criticalShift, employees);

    // If there are no possibilities for a shift, consider splitting before giving up
    if (possibilities.length === 0) {
      let shiftsAfterSplitting = shifts;

      if (enableShiftSplitting) {
        const newShifts = splitShiftIntoSegments(
          criticalShift,
          getPartiallyAvailableEmployeesForShift(employees),
          minShiftDuration,
        );
        const updatedShifts = shifts.map((s) => (s === criticalShift ? newShifts : s)).flat();

        const result = generateSchedule(updatedShifts, employees);

        if (result !== null) return result;

        shiftsAfterSplitting = updatedShifts;
      }

      if (!bestSchedule || calculateVacancies(shiftsAfterSplitting) < calculateVacancies(bestSchedule)) {
        bestSchedule = shiftsAfterSplitting;
      }

      return null;
    }

    for (const employee of possibilities) {
      const updatedShifts = shifts.map((s) => (s === criticalShift ? { ...s, employees: [...s.employees, employee.id] } : s));

      const updatedEmployees = employees.map((e) => (e === employee ? {
        ...e,
        hours: e.hours + dayjs.duration(dayjs(criticalShift.end_time).diff(dayjs(criticalShift.start_time))).asHours(),
        assigned: (() => {
          const newAssigned = [...e.assigned];
          const intervals = getIntervalsForShift(criticalShift);
          intervals.forEach((interval) => { newAssigned[interval] = 1; });
          return newAssigned;
        })(),
      } : e));

      const result = generateSchedule(updatedShifts, updatedEmployees);
      if (result !== null) return result;

      if (!bestSchedule || calculateVacancies(shifts) < calculateVacancies(bestSchedule)) {
        bestSchedule = shifts;
      }
    }

    return null;
  }

  // Initialize employees and assign initial availability
  employees = employees.map((employee) => {
    const assigned = shifts
      .filter((shift) => shift.employees.includes(employee.id))
      .reduce((acc, shift) => {
        const shiftIntervals = getIntervalsForShift(shift);
        shiftIntervals.forEach((interval) => {
          acc[interval] = 1;
        });
        return acc;
      }, Array(employee.availability.length).fill(0))
      .join('');

    return {
      ...employee,
      hours: 0,
      assigned,
    };
  });

  // Generate the schedule
  const result = generateSchedule(shifts, employees) ?? bestSchedule;

  // Add excess if specified
  if (addExcess) return addExcessEmployees(result, employees);
  return result;
};
