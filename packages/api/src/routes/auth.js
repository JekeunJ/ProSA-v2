const express = require('express');
const status = require('http-status');
const compileTemplate = require('lib/helpers/compileTemplate');
const Employer = require('lib/models/Employer');
const Token = require('lib/models/Token');
const User = require('lib/models/User');
const resend = require('lib/resend');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/login/email', async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({ email: req.body.email });

    const token = await Token.create({ user: user.id, strategy: 'email' });

    const loginLink = token.getLoginLink(
      req.query.redirect?.toString() || '/dashboard',
    );

    // TODO: Use a template
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: req.body.email,
      subject: 'Log in to ProSa',
      html: await compileTemplate('login', { login_link: loginLink }),
    });

    res.sendStatus(status.OK);
  } catch (err) {
    next(err);
  }
});

router.post('/recycle', async (req, res, next) => {
  try {
    const oldToken = await Token.findById(req.body.authorization);
    if (!oldToken) return res.sendStatus(status.UNAUTHORIZED);

    const newToken = await Token.create({
      user: oldToken.user,
      strategy: oldToken.strategy,
    });

    await User.findByIdAndUpdate(oldToken.user, { last_login: Date.now() });
    await oldToken.deleteOne();

    res.send({ authorization: newToken.id });
  } catch (err) {
    next(err);
  }
});

router.get('/user', auth(), async (req, res, next) => {
  try {
    res.send({
      user: res.locals.user,
      employee: res.locals.employee,
      employer: res.locals.employer,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/employer', auth(), async (req, res, next) => {
  try {
    const employer = res.locals.employer || await Employer.findById(res.locals.employee.employer);

    res.send(employer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
