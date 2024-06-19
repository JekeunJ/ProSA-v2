const express = require('express');
const Handlebars = require('handlebars');
const status = require('http-status');
const Practice = require('lib/models/Practice');
const Token = require('lib/models/Token');
const User = require('lib/models/User');
const resend = require('lib/resend');
const staffInviteTemplate = require('lib/templates/practitioner_invite.hbs');
const practitionerInviteTemplate = require('lib/templates/practitioner_invite.hbs');
const Practitioner = require('../../../../lib/models/Practitioner');
const auth = require('../../middlewares/auth');

const router = express.Router();

// Creating a new practice from the dashboard
router.post('/practice', auth(), async (req, res, next) => {
  try {
    const practice = await Practice.create({
      ...req.body,
      owner: req.user,
      staff: [req.user],
    });

    res.send(practice);
  } catch (err) {
    next(err);
  }
});

// Adding new staff
router.post('/practice/staff', auth([Practice]), async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({ email: req.body.email });

    // Add staff member to practice
    await Practice.findByIdAndUpdate(res.locals.practice.id, { $addToSet: { staff: user.id } });

    // Create token & login link
    const token = await Token.create({ user: user.id, strategy: 'email' });
    const loginLink = token.getLoginLink(
      req.query.redirect?.toString() || '/dashboard',
      { practice: res.locals.practice.id },
    );

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: req.body.email,
      subject: 'Log in to Recoverise',
      html: Handlebars.compile(staffInviteTemplate)({ login_link: loginLink }),
    });

    res.sendStatus(status.OK);
  } catch (err) {
    next(err);
  }
});

// Removing staff
router.delete('/practice/staff/:id', auth([Practice]), async (req, res, next) => {
  try {
    // Verify that this is being called by the practice owner (later we can build more permissions)
    if (res.locals.user.id !== res.locals.practice.owner) return res.sendStatus(status.UNAUTHORIZED);

    // Verify valid request
    if (!req.body.user || !res.locals.practice.staff.includes((u) => u === req.body.user)) return res.sendStatus(status.BAD_REQUEST);

    // Remove staff member from practice
    await Practice.findByIdAndUpdate(res.locals.practice.id, { $pull: { staff: req.body.user } });

    res.sendStatus(status.OK);
  } catch (err) {
    next(err);
  }
});

// Adding new practitinoners
router.post('/practice/practitioner', auth([Practice]), async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({ email: req.body.email });

    // Create practitioner
    const practitioner = await Practitioner.create({
      ...req.body,
      user: user.id,
      practice: res.locals.practice.id,
    });

    // Create token & login link
    const token = await Token.create({ user: user.id, strategy: 'email' });
    const loginLink = token.getLoginLink(
      req.query.redirect?.toString() || '/dashboard',
      { practice: res.locals.practice.id },
    );

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: req.body.email,
      subject: 'Log in to Recoverise',
      html: Handlebars.compile(practitionerInviteTemplate)({ login_link: loginLink, practitioner }),
    });

    res.sendStatus(status.OK);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
