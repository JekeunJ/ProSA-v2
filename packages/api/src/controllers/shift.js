const status = require('http-status');
const Shift = require('lib/models/Shift');

// Create a shift
module.exports.createShift = async function createShift(req, res, next) {
  try {
    const shift = await Shift.create({
      ...req.body,
      employer: res.locals.employer,
    });

    if (!shift) return res.sendStatus(status.NOT_FOUND);

    res.send(shift.toJSON());
  } catch (err) {
    next(err);
  }
};

// Retrieve a shift
module.exports.retrieveShift = async function retrieveShift(req, res, next) {
  try {
    const shift = await Shift.findOne({
      _id: req.params.id,
      ...(res.locals.employer && { employer: res.locals.employer }),
      ...(res.locals.employee && { employer: res.locals.employee.employer }),
    });

    if (!shift) return res.sendStatus(status.NOT_FOUND);

    res.send(shift.toJSON());
  } catch (err) {
    next(err);
  }
};

// Update a shift
module.exports.updateShift = async function updateShift(req, res, next) {
  try {
    const shift = await Shift.findOneAndUpdate({
      _id: req.params.id,
      ...(res.locals.employer && { employer: res.locals.employer }),
      ...(res.locals.employee && { employer: res.locals.employee.employer }),
    }, req.body, { runValidators: true, new: true });

    if (!shift) return res.sendStatus(status.NOT_FOUND);

    res.send(shift.toJSON());
  } catch (err) {
    next(err);
  }
};

// List shifts
module.exports.listShifts = async function listShifts(req, res, next) {
  try {
    const shifts = await Shift.paginate({
      ...req.query,
      ...(res.locals.employer && { employer: res.locals.employer }),
      ...(res.locals.employee && { employer: res.locals.employee.employer }),
    });

    res.send(shifts);
  } catch (err) {
    next(err);
  }
};

// Delete a shift
module.exports.deleteShift = async function deleteShift(req, res, next) {
  try {
    const shift = await Shift.findOne({
      _id: req.params.id,
      ...(res.locals.employer && { employer: res.locals.employer }),
    });

    if (!shift) return res.sendStatus(status.NOT_FOUND);

    await shift.deleteOne();

    res.sendStatus(status.ACCEPTED);
  } catch (err) {
    next(err);
  }
};
