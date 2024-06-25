const { nanoid } = require('nanoid');
const mongoose = require('../mongoose');
const Employee = require('./Employee');
const Employer = require('./Employer');

const shiftSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  name: { // Optional shift name, e.g. Morning/Noon/Night
    type: String,
    default: null,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true,
    get: (v) => v?.getTime(),
  },
  start_time: {
    type: Date,
    required: true,
    get: (v) => v?.getTime(),
  },
  end_time: {
    type: Date,
    required: true,
    get: (v) => v?.getTime(),
    validate(v) { return v > this.start_time; }, // Must be after start time
  },
  min_employees: {
    type: Number,
    required: true,
    min: 0,
  },
  max_employees: {
    type: Number,
    default: null,
    min: 0,
  },
  employer: {
    type: String,
    immutable: true,
    required: true,
    ref: 'Employer',
    validate: (v) => Employer.exists({ _id: v }),
  },
  /* TODO: Only allow employee additions if below employer.settings.max_per_shift */
  employees: [{
    type: String,
    immutable: true,
    ref: 'Employee',
    validate: (v) => Employee.exists({ _id: v }),
  }],
  /* If the shift is canceled, no one can sign up for it */
  /* TODO: This has a number of prerequisites (shift is upcoming) and effects (remove all employees) so only cancelable through DELETE route */
  canceled: {
    type: Boolean,
    default: false,
  },
});

shiftSchema.index({ user: 1 });

shiftSchema.virtual('duration').get(function () {
  return this.end_time - this.start_time;
});

shiftSchema.virtual('status').get(function () {
  if (this.canceled) return 'canceled';

  if (Date.now() < this.start_time) return 'upcoming';
  else if (Date.now() <= this.end_time) return 'active';

  return 'completed';
});

shiftSchema.pre('save', async function () {
  const employer = await Employer.findById(this.employer);

  // Fill in default shift settings
  if (this.min_employees == null)
    this.min_employees = employer.settings.min_employees_per_shift;

  if (employer.settings.max_employees_per_shift != null && this.max_employees == null)
    this.max_employees = employer.settings.max_employees_per_shift;
});

shiftSchema.post('findOneAndUpdate', async (shift) => {
  if (!shift) return;

  if (shift.employees.length < shift.min_employees) {
    // Notify all available employees of the opening
  }
});

module.exports = mongoose.models.Shift || mongoose.model('Shift', shiftSchema);
