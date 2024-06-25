const dayjs = require('lib/dayjs');

module.exports = {
  names: [
    'Alex Smith',
    'Jamie Doe',
    'Jordan Brown',
    'Taylor Johnson',
    'Casey White',
    'Morgan Jones',
    'Chris Lee',
    'Dakota Miller',
    'Jesse Davis',
    'Pat Morgan',
    'Sam Wilson',
    'Alexis Garcia',
    'Riley Martin',
    'Drew Anderson',
    'Cameron Thompson',
    'Robin Thomas',
    'Charlie Martinez',
    'Bailey Robinson',
    'Shawn Clark',
    'Terry Rodriguez',
    'Leslie Lewis',
    'Francis Walker',
    'Stevie Hall',
    'Jordan Allen',
    'Kelly Young',
    'Casey King',
    'Brooklyn Wright',
    'Kris Green',
    'Dana Adams',
    'Quinn Nelson',
    'Skyler Baker',
    'River Carter',
    'Blair Mitchell',
    'Sage Perez',
    'Phoenix Roberts',
    'Reese Campbell',
    'Lane Parker',
    'Devin Evans',
    'Reagan Edwards',
    'Payton Collins',
    'Emerson Stewart',
    'Shannon Morris',
    'Rory Reed',
    'Elliot Cook',
    'Sawyer Bell',
    'Kendall Murphy',
    'Blaine Bailey',
    'Avery Rivera',
    'Harley Cooper',
    'Dallas Gray',
  ],
  shiftsPerCycle: [
    // Week 1
    // Monday to Friday: Morning, Noon, Night Shifts
    {
      name: 'Morning', start_time: dayjs.duration({ days: 0, hours: 9 }).asMilliseconds(), end_time: dayjs.duration({ days: 0, hours: 17 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Monday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 0, hours: 12 }).asMilliseconds(), end_time: dayjs.duration({ days: 0, hours: 20 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Monday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 0, hours: 20 }).asMilliseconds(), end_time: dayjs.duration({ days: 1, hours: 4 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Monday Night

    // Tuesday
    {
      name: 'Morning', start_time: dayjs.duration({ days: 1, hours: 9 }).asMilliseconds(), end_time: dayjs.duration({ days: 1, hours: 17 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Tuesday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 1, hours: 12 }).asMilliseconds(), end_time: dayjs.duration({ days: 1, hours: 20 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Tuesday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 1, hours: 20 }).asMilliseconds(), end_time: dayjs.duration({ days: 2, hours: 4 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Tuesday Night

    // Wednesday: Switch up times
    {
      name: 'Morning', start_time: dayjs.duration({ days: 2, hours: 6 }).asMilliseconds(), end_time: dayjs.duration({ days: 2, hours: 14 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Wednesday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 2, hours: 10 }).asMilliseconds(), end_time: dayjs.duration({ days: 2, hours: 18 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Wednesday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 2, hours: 18 }).asMilliseconds(), end_time: dayjs.duration({ days: 3, hours: 2 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Wednesday Night

    // Thursday
    {
      name: 'Morning', start_time: dayjs.duration({ days: 3, hours: 9 }).asMilliseconds(), end_time: dayjs.duration({ days: 3, hours: 17 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Thursday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 3, hours: 12 }).asMilliseconds(), end_time: dayjs.duration({ days: 3, hours: 20 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Thursday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 3, hours: 20 }).asMilliseconds(), end_time: dayjs.duration({ days: 4, hours: 4 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Thursday Night

    // Friday
    {
      name: 'Morning', start_time: dayjs.duration({ days: 4, hours: 9 }).asMilliseconds(), end_time: dayjs.duration({ days: 4, hours: 17 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Friday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 4, hours: 12 }).asMilliseconds(), end_time: dayjs.duration({ days: 4, hours: 20 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Friday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 4, hours: 20 }).asMilliseconds(), end_time: dayjs.duration({ days: 5, hours: 4 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Friday Night

    // Saturday: Noon, Evening, Late Night
    {
      name: 'Noon', start_time: dayjs.duration({ days: 5, hours: 12 }).asMilliseconds(), end_time: dayjs.duration({ days: 5, hours: 20 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Saturday Noon
    {
      name: 'Evening', start_time: dayjs.duration({ days: 5, hours: 14 }).asMilliseconds(), end_time: dayjs.duration({ days: 5, hours: 22 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Saturday Evening
    {
      name: 'Late Night', start_time: dayjs.duration({ days: 5, hours: 22 }).asMilliseconds(), end_time: dayjs.duration({ days: 6, hours: 6 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Saturday Late Night

    // Sunday: Noon, Evening, Late Night
    {
      name: 'Noon', start_time: dayjs.duration({ days: 6, hours: 12 }).asMilliseconds(), end_time: dayjs.duration({ days: 6, hours: 20 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Sunday Noon
    {
      name: 'Evening', start_time: dayjs.duration({ days: 6, hours: 14 }).asMilliseconds(), end_time: dayjs.duration({ days: 6, hours: 22 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Sunday Evening
    {
      name: 'Late Night', start_time: dayjs.duration({ days: 6, hours: 22 }).asMilliseconds(), end_time: dayjs.duration({ days: 7, hours: 6 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Sunday Late Night

    // Week 2 - Slight variations in shift timings
    // Monday to Friday: Morning, Noon, Night Shifts
    {
      name: 'Morning', start_time: dayjs.duration({ days: 7, hours: 8 }).asMilliseconds(), end_time: dayjs.duration({ days: 7, hours: 16 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Monday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 7, hours: 11 }).asMilliseconds(), end_time: dayjs.duration({ days: 7, hours: 19 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Monday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 7, hours: 19 }).asMilliseconds(), end_time: dayjs.duration({ days: 8, hours: 3 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Monday Night

    // Tuesday
    {
      name: 'Morning', start_time: dayjs.duration({ days: 8, hours: 8 }).asMilliseconds(), end_time: dayjs.duration({ days: 8, hours: 16 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Tuesday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 8, hours: 11 }).asMilliseconds(), end_time: dayjs.duration({ days: 8, hours: 19 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Tuesday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 8, hours: 19 }).asMilliseconds(), end_time: dayjs.duration({ days: 9, hours: 3 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Tuesday Night

    // Wednesday: Switch up times
    {
      name: 'Morning', start_time: dayjs.duration({ days: 9, hours: 7 }).asMilliseconds(), end_time: dayjs.duration({ days: 9, hours: 15 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Wednesday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 9, hours: 10 }).asMilliseconds(), end_time: dayjs.duration({ days: 9, hours: 18 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Wednesday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 9, hours: 18 }).asMilliseconds(), end_time: dayjs.duration({ days: 10, hours: 2 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Wednesday Night

    // Thursday
    {
      name: 'Morning', start_time: dayjs.duration({ days: 10, hours: 8 }).asMilliseconds(), end_time: dayjs.duration({ days: 10, hours: 16 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Thursday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 10, hours: 11 }).asMilliseconds(), end_time: dayjs.duration({ days: 10, hours: 19 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Thursday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 10, hours: 19 }).asMilliseconds(), end_time: dayjs.duration({ days: 11, hours: 3 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Thursday Night

    // Friday
    {
      name: 'Morning', start_time: dayjs.duration({ days: 11, hours: 8 }).asMilliseconds(), end_time: dayjs.duration({ days: 11, hours: 16 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Friday Morning
    {
      name: 'Noon', start_time: dayjs.duration({ days: 11, hours: 11 }).asMilliseconds(), end_time: dayjs.duration({ days: 11, hours: 19 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Friday Noon
    {
      name: 'Night', start_time: dayjs.duration({ days: 11, hours: 19 }).asMilliseconds(), end_time: dayjs.duration({ days: 12, hours: 3 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Friday Night

    // Saturday: Noon, Evening, Late Night
    {
      name: 'Noon', start_time: dayjs.duration({ days: 12, hours: 13 }).asMilliseconds(), end_time: dayjs.duration({ days: 12, hours: 21 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Saturday Noon
    {
      name: 'Evening', start_time: dayjs.duration({ days: 12, hours: 15 }).asMilliseconds(), end_time: dayjs.duration({ days: 12, hours: 23 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Saturday Evening
    {
      name: 'Late Night', start_time: dayjs.duration({ days: 12, hours: 23 }).asMilliseconds(), end_time: dayjs.duration({ days: 13, hours: 7 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Saturday Late Night

    // Sunday: Noon, Evening, Late Night
    {
      name: 'Noon', start_time: dayjs.duration({ days: 13, hours: 13 }).asMilliseconds(), end_time: dayjs.duration({ days: 13, hours: 21 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Sunday Noon
    {
      name: 'Evening', start_time: dayjs.duration({ days: 13, hours: 15 }).asMilliseconds(), end_time: dayjs.duration({ days: 13, hours: 23 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Sunday Evening
    {
      name: 'Late Night', start_time: dayjs.duration({ days: 13, hours: 23 }).asMilliseconds(), end_time: dayjs.duration({ days: 14, hours: 7 }).asMilliseconds(), min_employees: 2, max_employees: 5,
    }, // Sunday Late Night
  ],
};
