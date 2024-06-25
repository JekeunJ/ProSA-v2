const { nanoid } = require('nanoid');
const mongoose = require('../mongoose');
const Employee = require('./Employee');
const Employer = require('./Employer');

const friendshipSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true,
    get: (v) => v?.getTime(),
  },
  employer: {
    type: String,
    immutable: true,
    required: true,
    ref: 'Employer',
    validate: (v) => Employer.exists({ _id: v }),
  },
  /* Should always have exactly 2 employees */
  employees: {
    type: [String],
    immutable: true,
    required: true,
    ref: 'Employee',
    set: (v) => v.sort(),
    async validate(v) {
      return v.length === 2
      && v[0] !== v[1]
      && !(await mongoose.models.Friendship.exists({ employees: { $all: v } }))
      && (await Promise.all(
        v.map((e) => Employee.exists({ _id: e, employer: this.employer })),
      )).every((e) => e);
    },
  },
}, {
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
});

friendshipSchema.index({ employees: 1 });

module.exports = mongoose.models.Friendship || mongoose.model('Friendship', friendshipSchema);
