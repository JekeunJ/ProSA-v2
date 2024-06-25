const status = require('http-status');
const Employee = require('lib/models/Employee');
const Employer = require('lib/models/Employer');
const Token = require('lib/models/Token');
const User = require('lib/models/User');

require('lib/models/User');

module.exports = function auth(permissions) {
  permissions = permissions ?? [];

  return async function (req, res, next) {
    if (!req.cookies.authorization) return res.sendStatus(status.UNAUTHORIZED);

    // Fetch relevant token
    const token = await Token.findById(req.cookies.authorization);

    // Reject if authorization token not found
    if (!token) return res.sendStatus(status.UNAUTHORIZED);

    // Find the user, reject if none
    const user = await User.findById(token.user).populate('employers employees');
    if (!user) return res.sendStatus(status.UNAUTHORIZED);
    res.locals.user = user;

    // If employer is a valid requester, get either matching or first employer
    if (!permissions.length || permissions.includes(Employer)) {
      res.locals.employer = req.get('ProSa-Employer')
        ? user.employers.find((employer) => employer.id === req.get('ProSa-Employer'))
        : user.employers[0];
    }

    // If employee is a valid requester, get either matching or first employee
    if (!permissions.length || permissions.includes(Employee)) {
      res.locals.employee = req.get('ProSa-Emplooyer')
        ? user.employees.find((employee) => employee.employer === req.get('ProSa-Employer'))
        : user.employees[0];
    }

    // Reject if no valid requester
    if (permissions.length && !permissions.some((model) => !!res.locals[model.modelName.toLowerCase()]))
      return res.sendStatus(status.UNAUTHORIZED);

    next();
  };
};
