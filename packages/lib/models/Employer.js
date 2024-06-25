const { nanoid } = require('nanoid');
const countries = require('../constants/countries');
const dayjs = require('../dayjs');
const { holidays, getHolidays } = require('../helpers/holidays');
const mongoose = require('../mongoose');
const User = require('./User');

const shiftSettingSchema = new mongoose.Schema({
  name: { // Optional shift name, e.g. Morning/Noon/Night
    type: String,
    default: null,
    trim: true,
  },
  start_time: {
    type: Number, // Not a date -- stored as millis from beginning of the week
    required: true,
    min: 0,
  },
  end_time: {
    type: Number,
    required: true,
    validate(v) { return v > this.start_time; }, // Must be after start time
  },
  /* Optional, filled in from defaults if not present */
  min_employees: {
    type: Number,
    default: null,
    min: 0,
  },
  max_employees: {
    type: Number,
    default: null,
    min: 0,
  },
}, {
  _id: false,
  toJSON: { getters: true },
  toObject: { getters: true },
});

const employerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  name: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true,
    get: (v) => v?.getTime(),
  },
  user: {
    type: String,
    immutable: true,
    required: true,
    ref: 'User',
    validate: (v) => User.exists({ _id: v }),
  },
  /* The employer can pick up shifts too -- it has its own "employee" for this, which we manage under the hood */
  employee: {
    type: String,
    immutable: true,
    default: null, // This should always be populated, but the employee is created after validation
    ref: 'Employee',
  },
  /* Business info to collect -- in the future this should be its own model, but this will be simpler for MVP */
  business: {
    name: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        trim: true,
        default: null,
      },
      country: {
        type: String,
        trim: true,
        default: null,
      },
      line1: {
        type: String,
        trim: true,
        default: null,
      },
      line2: {
        type: String,
        trim: true,
        default: null,
      },
      postal_code: {
        type: String,
        trim: true,
        default: null,
      },
      state: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  settings: {
    shifts_per_cycle: [shiftSettingSchema],
    cycle_length: { // How many weeks is one cycle? Automatically filled based on shifts
      type: Number,
      default: 1,
      min: 1,
    },
    cycles_scheduled: { // How many cycles should be scheduled at a time?
      type: Number,
      default() {
        return Math.max(
          Math.ceil((4 / this.settings.cycle_length)),
          2,
        ); // Whichever is bigger between 2 cycles and 1 month
      },
      min: 1,
    },
    last_cycle_end: { // The last scheduled cycle's end date -- used for scheduling
      type: Date,
      hidden: true,
      set: (v) => dayjs(v).startOf('week').startOf('day'),
      get: (v) => v?.getTime(),
      default: null,
    },
    /* These two are defaults for all shifts */
    min_employees_per_shift: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    max_employees_per_shift: {
      type: Number,
      default: null,
    },
    /* Do we automatically not schedule shifts on holidays? */
    holidays_off: [{
      type: String,
      enum: holidays.map((holiday) => holiday.id),
    }],
  },
}, {
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
});

employerSchema.index({ user: 1 });

employerSchema.virtual('employees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'employer',
  justOne: true,
});

employerSchema.virtual('shifts', {
  ref: 'Shift',
  localField: 'employee',
  foreignField: 'employees',
  justOne: true,
});

employerSchema.pre('validate', async function () {
  // Get the last shift in shifts_per_cycle
  const lastShiftPerCycle = this.settings.shifts_per_cycle
    .reduce((prev, curr) => (prev.end_time > curr.end_time ? prev : curr));

  // How many weeks does this encompass?
  this.settings.cycle_length = Math.ceil(dayjs.duration(lastShiftPerCycle.end_time).asWeeks());

  // If there are no holidays, fill in regional holidays
  if (!this.settings.holidays_off) {
    // Find conutry from address
    const country = countries.find((c) => (c.countryCode.toLowerCase() === this.address.country.toLowerCase())
      || (c.countryNameEn.toLowerCase() === this.address.country.toLowerCase())
      || (c.countryNameLocal.toLowerCase() === this.address.country.toLowerCase()));

    this.settings.holidays_off = getHolidays({
      ...(country && { country: country.countryCode }),
    }, {
      type: 'public',
    }).map((holiday) => holiday.id);
  }
});

employerSchema.pre('save', async function () {
  const Employee = require('./Employee');

  // Create the employee
  const employee = await Employee.create({
    employer: this.id,
    name: this.name,
    user: this.user,
    is_employer: true,
  });

  this.employee = employee.id;
});

employerSchema.post('deleteOne', async function () {
  const Employee = require('./Employee');
  const Shift = require('./Shift');

  // Delete shifts
  await Shift.deleteMany({ employer: this._id });

  // Delete employees
  await Employee.deleteMany({ employer: this._id });
});

module.exports = mongoose.models.Employer || mongoose.model('Employer', employerSchema);
