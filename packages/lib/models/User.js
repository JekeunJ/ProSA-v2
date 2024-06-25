const { nanoid } = require('nanoid');
const mongoose = require('../mongoose');

const userSchema = new mongoose.Schema({
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
  // Email is required
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
  },
  // Phone is optional, but recommended
  phone: {
    type: String,
    default: null,
    trim: true,
    validate: (v) => !v || /^\+\d{10,15}$/.test(v),
  },
}, {
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.virtual('employees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

userSchema.virtual('employers', {
  ref: 'Employer',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

userSchema.methods.generateToken = async function generateToken() {
  // Delete previous tokens to invalidate
  await mongoose.models.Token.deleteMany({ user: this.id });

  // Create a new token and return
  return mongoose.models.Token.create({ user: this.id });
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
