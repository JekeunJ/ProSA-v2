const status = require('http-status');
const Employer = require('lib/models/Employer');

// Create an employer
module.exports.createEmployer = async function createEmployer(req, res, next) {
  try {
    const employer = await Employer.create({
      ...req.body,
      user: res.locals.user,
    });

    if (!employer) return res.sendStatus(status.NOT_FOUND);

    res.send(employer.toJSON());
  } catch (err) {
    next(err);
  }
};

// Retrieve an employer
module.exports.retrieveEmployer = async function retrieveEmployer(req, res, next) {
  try {
    const employer = await Employer.findOne({
      _id: req.params.id,
      ...(res.locals.employer && { _id: res.locals.employer.id }),
      ...(res.locals.employee && { _id: res.locals.employee.employer }),
    });

    if (!employer) return res.sendStatus(status.NOT_FOUND);

    res.send(employer.toJSON());
  } catch (err) {
    next(err);
  }
};

// Update an employer
module.exports.updateEmployer = async function updateEmployer(req, res, next) {
  try {
    const employer = await Employer.findOneAndUpdate({
      _id: req.params.id,
      ...(res.locals.employer && { _id: res.locals.employer.id }),
    }, req.body, { runValidators: true, new: true });

    if (!employer) return res.sendStatus(status.NOT_FOUND);

    res.send(employer.toJSON());
  } catch (err) {
    next(err);
  }
};

// List employers
module.exports.listEmployers = async function listEmployers(req, res, next) {
  try {
    const employers = await Employer.paginate({
      ...req.query,
      ...(res.locals.employer && { _id: res.locals.employer.id }),
      ...(res.locals.employee && { _id: res.locals.employee.employer }),
    });

    res.send(employers);
  } catch (err) {
    next(err);
  }
};

// Delete an employer
module.exports.deleteEmployer = async function deleteEmployer(req, res, next) {
  try {
    const employer = await Employer.findOne({
      _id: req.params.id,
      ...(res.locals.employer && { _id: res.locals.employer.id }),
    });

    if (!employer) return res.sendStatus(status.NOT_FOUND);

    await employer.deleteOne();

    res.sendStatus(status.ACCEPTED);
  } catch (err) {
    next(err);
  }
};
