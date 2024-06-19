const { nanoid } = require('nanoid');
const dayjs = require('../dayjs');
const mongoose = require('../mongoose');
const { isValidBitmap, bitmapArrayToString } = require('../services/availability');
const Employer = require('./Employer');
const User = require('./User');

const employeeSchema = new mongoose.Schema({
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
  employer: {
    type: String,
    immutable: true,
    required: true,
    ref: 'Employer',
    validate: (v) => Employer.exists({ _id: v }),
  },
  is_employer: {
    type: Boolean,
    immutable: true,
    default: false,
  },
  /* Availability to pick up shifts */
  availability: {
    weekly: {
      type: String,
      required: true,
      validate: (v) => isValidBitmap(v),
    },
    scheduled: [{
      week_of: {
        type: Date,
        required: true,
        set: (v) => dayjs(v).startOf('week').startOf('day'),
        get: (v) => v?.getTime(),
      },
      availability: {
        type: String,
        required: true,
        set: (v) => (Array.isArray(v) ? bitmapArrayToString(v) : v),
        validate: (v) => isValidBitmap(v),
      },
    }],
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
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      line1: {
        type: String,
        default: null,
      },
      line2: {
        type: String,
        default: null,
      },
      postal_code: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
    },
    settings: {
      shift_duration: {
        /* Bruh..... */
      },
    },
  },
});

employeeSchema.index({ user: 1 });
employeeSchema.index({ user: 1, employer: 1 }, { unique: true }); // Only one employee per user & employer

employeeSchema.virtual('shifts', {
  ref: 'Shift',
  localField: '_id',
  foreignField: 'employees',
  justOne: true,
});

module.exports = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
