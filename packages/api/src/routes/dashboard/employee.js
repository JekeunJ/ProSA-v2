const express = require('express');
const Handlebars = require('handlebars');
const status = require('http-status');
const Client = require('lib/models/Client');
const Practice = require('lib/models/Practice');
const Practitioner = require('lib/models/Practitioner');
const Token = require('lib/models/Token');
const User = require('lib/models/User');
const resend = require('lib/resend');
const clientInviteTemplate = require('lib/templates/client_invite.hbs');
const auth = require('../../middlewares/auth');

const router = express.Router();

// Creating a new independent practitioner from the dashboard
router.post('/practitioner', auth(), async (req, res, next) => {
  try {
    const practitioner = await Practitioner.create({
      ...req.body,
      practice: null,
      user: req.user,
    });

    res.send(practitioner);
  } catch (err) {
    next(err);
  }
});

// Adding new clients
router.post('/practitioner/client', auth([Practice, Practitioner]), async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({ email: req.body.email });

    // Create client
    const client = await Client.create({
      ...req.body,
      user: user.id,
      ...(res.locals.practice && { practice: res.locals.practice.id }),
      ...(res.locals.practitioner && {
        practitioner: res.locals.practitioner.id,
        practice: res.locals.practitioner.practice,
      }),
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
      html: Handlebars.compile(clientInviteTemplate)({ login_link: loginLink, client }),
    });

    res.sendStatus(status.OK);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
