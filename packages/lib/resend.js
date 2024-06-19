const { Resend } = require('resend');

/* TODO: Blasberg gotta lemme set up the domain so that this works */
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = resend;
