const status = require('http-status');
const Employee = require('lib/models/Employee');
const Friendship = require('lib/models/Friendship');
const User = require('lib/models/User');

// Create/invite an employee
module.exports.createEmployee = async function createEmployee(req, res, next) {
  try {
    // Find a user if it exists -- otherwise, create
    let user = req.body.email && await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({
      email: req.body.email,
      phone: req.body.phone,
    });

    const employee = await Employee.create({
      ...req.body,
      user: user.id,
      employer: res.locals.employer.id,
      is_employer: false,
    });

    res.send(employee.toJSON());
  } catch (err) {
    next(err);
  }
};

// Retrieve an employee
module.exports.retrieveEmployee = async function retrieveEmployee(req, res, next) {
  try {
    const employee = await Employee.findOne({
      ...req.query,
      _id: req.params.id,
      ...(res.locals.employer && { employer: res.locals.employer.id }),
      ...(res.locals.employee && { employer: res.locals.employee.employer }),
    });

    if (!employee) return res.sendStatus(status.NOT_FOUND);

    res.send(employee.toJSON());
  } catch (err) {
    next(err);
  }
};

// Update an employee
module.exports.updateEmployee = async function updateEmployee(req, res, next) {
  try {
    const employee = await Employee.findOneAndUpdate({
      ...req.query,
      _id: req.params.id,
      ...(res.locals.employer && { employer: res.locals.employer.id }),
      ...(!res.locals.employer && res.locals.employee && { _id: res.locals.employee.id }),
    }, req.body, { runValidators: true, new: true });

    if (!employee) return res.sendStatus(status.NOT_FOUND);

    res.send(employee.toJSON());
  } catch (err) {
    next(err);
  }
};

// Set employees as friends
module.exports.setEmployeeFriend = async function setEmployeeFriend(req, res, next) {
  try {
    const friendship = await Friendship.create({
      employess: req.body.employees,
      ...(res.locals.employer && { employer: res.locals.employer.id }),
    });

    if (!friendship) return res.sendStatus(status.NOT_FOUND);

    res.send(friendship.toJSON());
  } catch (err) {
    next(err);
  }
};

// Remove a friendship record
module.exports.removeEmployeeFriend = async function removeEmployeeFriend(req, res, next) {
  try {
    const friendship = await Friendship.findOne({
      employees: { $all: req.body.employees },
      ...(res.locals.employer && { employer: res.locals.employer.id }),
    });

    if (!friendship) return res.sendStatus(status.NOT_FOUND);

    await friendship.deleteOne();

    res.send(friendship.toJSON());
  } catch (err) {
    next(err);
  }
};

// List employees
module.exports.listEmployees = async function listEmployees(req, res, next) {
  try {
    const employees = await Employee.paginate({
      ...req.query,
      ...(res.locals.employer && { employer: res.locals.employer.id }),
      ...(res.locals.employee && { employer: res.locals.employee.employer }),
    });

    res.send(employees);
  } catch (err) {
    next(err);
  }
};

// Delete an employee
module.exports.deleteEmployee = async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      ...(res.locals.employer && { employer: res.locals.employer.id }),
      ...(res.locals.employee && { _id: res.locals.employee.id }),
    });

    if (!employee) return res.sendStatus(status.NOT_FOUND);
    if (employee.is_employer) return res.sendStatus(status.BAD_REQUEST);

    await employee.deleteOne();

    res.sendStatus(status.ACCEPTED);
  } catch (err) {
    next(err);
  }
};
