/* eslint-disable no-await-in-loop */
const { nanoid } = require('nanoid');
const dayjs = require('../dayjs');
const mongoose = require('../mongoose');
const { nineToFive, isValidBitmap, bitmapArrayToString } = require('../services/availability');
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
    validate(v) { return this.is_employer || Employer.exists({ _id: v }); },
  },
  is_employer: {
    type: Boolean,
    immutable: true,
    default: false,
  },
  /* As per request, ratings & friends */
  rating: {
    type: Number,
    min: 0,
    max: 5,
    set: (v) => Math.round(v),
    default: null,
  },
  /* Availability to pick up shifts */
  availability: {
    weekly: {
      type: String,
      default: nineToFive, // Default to 9-5 availability
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
}, {
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
});

employeeSchema.index({ user: 1 });
employeeSchema.index({ user: 1, employer: 1 }, { unique: true }); // Only one employee per user & employer

employeeSchema.virtual('shifts', {
  ref: 'Shift',
  localField: '_id',
  foreignField: 'employees',
  justOne: true,
});

employeeSchema.virtual('friends', {
  ref: 'Friendship',
  localField: '_id',
  foreignField: 'employees',
  justOne: false,
  options: {
    select: 'employees',
    populate: {
      path: 'employees',
      select: '-friends',
    },
  },
  get(friendships) {
    return friendships
      ?.map((friendship) => friendship.employees
        .find((employee) => employee._id !== this._id));
  },
});

employeeSchema.virtual('hours', {
  ref: 'Shift',
  localField: '_id',
  foreignField: 'employees',
  justOne: false,
  options: {
    select: 'duration start_time end_time status',
    populate: {
      path: 'employees',
      select: '-friends',
    },
  },
  get(shifts) {
    return shifts
      ?.flatMap((shift) => {
        if (shift.status === 'canceled') return [];
        if (dayjs(shift.start_time).isSame(dayjs(shift.end_time), 'week')) return shift;

        const segments = [];
        let currentStart = dayjs(shift.start_time);
        const end = dayjs(shift.end_time);

        while (currentStart.isBefore(end)) {
          const endOfWeek = currentStart.add(1, 'second').endOf('week');
          if (end.isBefore(endOfWeek)) {
            segments.push({ start_time: currentStart.toDate(), end_time: end.toDate(), duration: end - currentStart });
            break;
          }

          segments.push({ start_time: currentStart.toDate(), end_time: endOfWeek.toDate(), duration: endOfWeek - currentStart });
          currentStart = endOfWeek;
        }

        return segments;
      })
      ?.reduce((hours, shift) => {
        const startWeek = dayjs(shift.start_time).startOf('week').unix();

        return {
          ...hours,
          [startWeek]: (hours[startWeek] || 0) + dayjs.duration(shift.duration).asHours(),
        };
      }, {});
  },
});

employeeSchema.post('deleteOne', async function () {
  const Shift = require('./Shift');
  const Friendship = require('./Friendship');

  // Remove employee from all shifts to which they are assigned
  const shifts = await Shift.find({ employees: this.id });
  await Promise.all(shifts.map(async (shift) => {
    await shift.updateOne({ $pull: { employees: this.id } }, { runValidators: true, new: true });
  }));

  // Remove employee from friends
  await Friendship.deleteMany({ employees: this.id });
});

module.exports = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
