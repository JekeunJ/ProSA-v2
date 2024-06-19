const status = require('http-status');
const Employee = require('lib/models/Employee');

// Retrieve an employee
module.exports.retrieveEmployee = async function retrieveEmployee(req, res, next) {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      ...(res.locals.employer && { _id: res.locals.employer.id }),
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
      _id: req.params.id,
      ...(res.locals.employer && { _id: res.locals.employer.id }),
    }, req.body, { runValidators: true, new: true });

    if (!employee) return res.sendStatus(status.NOT_FOUND);

    res.send(employee.toJSON());
  } catch (err) {
    next(err);
  }
};

// List employees
module.exports.listEmployees = async function listEmployees(req, res, next) {
  try {
    const employees = await Employee.paginate({
      ...req.query,
      ...(res.locals.practitioner && { practitioner: res.locals.practitioner.id }),
      ...(res.locals.practice && { practice: res.locals.practice.id }),
    });

    res.send(employees);
  } catch (err) {
    next(err);
  }
};

// Delete an employee
module.exports.deleteEmployee = async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(res.locals.employee.id);

    if (!employee) return res.sendStatus(status.NOT_FOUND);

    await employee.deleteOne();

    res.sendStatus(status.ACCEPTED);
  } catch (err) {
    next(err);
  }
};
