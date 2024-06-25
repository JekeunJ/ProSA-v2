const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const useragent = require('express-useragent');
const helmet = require('helmet');
const Employee = require('lib/models/Employee');
const Employer = require('lib/models/Employer');
const requestIp = require('request-ip');
const employee = require('../controllers/employee');
const employer = require('../controllers/employer');
const shift = require('../controllers/shift');
const user = require('../controllers/user');
const auth = require('../middlewares/auth');

const router = express.Router();

// Set up router
router.use(express.json({ extended: true, limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));
router.use(helmet());
router.use(cors());
router.use(cookieParser());
router.use(requestIp.mw());
router.use(useragent.express());

// Employers
router.post('/employers', auth(), employer.createEmployer);
router.get('/employers/:id', auth([Employer, Employee]), employer.retrieveEmployer);
router.patch('/employers/:id', auth([Employer]), employer.updateEmployer);
router.delete('/employers/:id', auth([Employer]), employer.deleteEmployer);
router.get('/employers', auth([Employer, Employee]), employer.listEmployers);

// Employees
router.post('/employees', auth([Employer]), employee.createEmployee);
router.get('/employees/:id', auth([Employer, Employee]), employee.retrieveEmployee);
router.patch('/employees/:id', auth([Employer, Employee]), employee.updateEmployee);
router.delete('/employese/:id', auth([Employer, Employee]), employee.deleteEmployee);
router.get('/employees', auth([Employer, Employee]), employee.listEmployees);

// Shifts
router.post('/shifts', auth([Employer]), shift.createShift);
router.get('/shifts/:id', auth([Employer, Employee]), shift.retrieveShift);
router.patch('/shifts/:id', auth([Employer, Employee]), shift.updateShift);
router.delete('/shifts/:id', auth([Employer]), shift.deleteShift);
router.get('/shifts', auth([Employer, Employee]), shift.listShifts);

// Users
router.get('/users', auth(), user.retrieveUser);
router.patch('/users', auth(), user.updateUser);

module.exports = router;
