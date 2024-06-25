/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* Populate database with a bunch of sample data for testing the dashboard */
const dayjs = require('lib/dayjs');
const Employee = require('lib/models/Employee');
const Employer = require('lib/models/Employer');
const Shift = require('lib/models/Shift');
const User = require('lib/models/User');
const mongoose = require('lib/mongoose');
const sample = require('lodash/sample');
const sampleSize = require('lodash/sampleSize');
const slugify = require('slugify');
const data = require('../data/populateSampleData');
const connect = require('../helpers/connect');

async function populateSampleData() {
  await connect();

  /* Reset DB */
  await mongoose.connection.db.dropDatabase();

  /* Create users for Jekeun and Robert */
  const jekeunUser = await User.create({
    email: 'jekeunjung@gmail.com',
    phone: '+2154980426',
  });

  const robertUser = await User.create({
    email: 'robertmay2003@gmail.com',
    phone: '+16102338511',
  });

  console.log('Created users');

  /* Create the employer -- Jekeun's the boss */
  const employer = await Employer.create({
    name: 'Jekeun Jung',
    user: jekeunUser.id,
    business: {
      name: 'ProSa Dev',
      address: {
        city: 'Penn Valley',
        country: 'USA',
        line1: '357 Hidden River Rd',
        postal_code: '19072',
        state: 'PA',
      },
    },
    settings: {
      shifts_per_cycle: data.shiftsPerCycle,
      cycle_length: 2,
    },
  });

  console.log('Created employer');

  /* Add Robert on as an employee */
  const robertEmployee = await Employee.create({
    name: 'Robert May',
    user: robertUser.id,
    employer: employer.id,
    availability: {
      weekly: '1'.repeat(2016), // Always available
    },
  });

  /* Create a bunch of sample employees -- let's say 5 */
  const employees = [await Employee.findById(employer.employee), robertEmployee];
  for (let i = 0; i < 5; i++) {
    const name = sample(data.names.filter((n) => !employees.map(({ name }) => name).includes(n)));

    const user = await User.create({
      email: `${slugify(name, { strict: true })}@prosadevsampledata.com`,
    });

    const employee = await Employee.create({
      name,
      employer: employer.id,
      user: user.id,
      rating: Math.round(Math.random() * 5),
      friends: sampleSize(
        employees.map((employee) => employee.id),
        Math.round(Math.random() * employees.length),
      ),
    });

    employees.push(employee);
  }

  console.log('Created employees');

  /* Schedule the current and next cycles */
  const currentCycleStart = dayjs().startOf('week').startOf('day');
  const nextCycleStart = currentCycleStart.add(employer.settings.cycle_length, 'weeks');

  for (const shiftSetting of employer.toJSON().settings.shifts_per_cycle) {
    // This cycle
    await Shift.create({
      ...shiftSetting,
      employer: employer.id,
      start_time: dayjs(shiftSetting.start_time).add(currentCycleStart).toDate(),
      end_time: dayjs(shiftSetting.end_time).add(currentCycleStart).toDate(),
      employees: sampleSize(
        employees.map((employee) => employee.id),
        Math.round(Math.random() * shiftSetting.max_employees),
      ),
    });

    // Next cycle
    await Shift.create({
      ...shiftSetting,
      employer: employer.id,
      start_time: dayjs(shiftSetting.start_time).add(nextCycleStart),
      end_time: dayjs(shiftSetting.end_time).add(nextCycleStart),
      employees: sampleSize(
        employees.map((employee) => employee.id),
        Math.round(Math.random() * shiftSetting.max_employees),
      ),
    });
  }

  console.log('Created shifts');

  console.log('Done!');
  process.exit(0);
}

(async () => populateSampleData())();
