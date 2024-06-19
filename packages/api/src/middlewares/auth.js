const status = require('http-status');
const Client = require('lib/models/Client');
const Practice = require('lib/models/Practice');
const Practitioner = require('lib/models/Practitioner');
const Token = require('lib/models/Token');
const User = require('lib/models/User');

require('lib/models/User');

/* Notes on auth:
  Auth is gonna be complex here. We have multiple types of users
  with different levels of access.

  1: Practices
  -> Read access to the client, practitioner, and practice (but not messages or sensitive doctor/patient data!)
  -> Write access to the practitioner and practice

  2: Practitioners
  -> Read access to the client, practitioner, and practice
  -> Write access only to the practitioner and documents relating
    to the client, but not the client themself

  3: Clients
  -> Read access to the client, practitioner, and practice
  -> Write access to the client and their own data

  In order to set up dynamic auth for each route, this middleware should take the parameter
    string[] permissions
  And should block any requests made by a user not in the listed permissions.
  It should store both the user making the request, and the resource of the entity making the request.
    e.g. if the array is [Practice, Practitioners], and the user making the request is a practitioner,
    we would store res.locals.practitioner, but res.locals.practice would remain null.
    We can still read the practice from the practitioner if need be but this makes it clear
    on the route level what information we are passing to our queries.
*/
module.exports = function auth(permissions) {
  if ((permissions || []).length === 0) permissions = [Practice, Practitioner, Client]; // Default to * permissions

  return async function (req, res, next) {
    if (!req.cookies.authorization) return res.sendStatus(status.UNAUTHORIZED);

    // Fetch relevant token
    const token = await Token.findById(req.cookies.authorization);

    // Reject if authorization token not found
    if (!token) return res.sendStatus(status.UNAUTHORIZED);

    // Find the user, reject if none
    const user = await User.findById(token.user);
    if (!user) return res.sendStatus(status.UNAUTHORIZED);
    res.locals.user = user;
    // Find requesting entity
    if (permissions.includes(Practice) && req.get('Recoverise-Practice')) {
      // Get practice and populate practitioners for permissions
      const practice = await Practice.findOne({
        _id: req.get('Recoverise-Practice'),
        $or: [
          { owner: res.locals.user.id },
          { staff: res.locals.user.id },
        ],
      }).populate('practitioners');

      res.locals.practice = practice;
    } else if (permissions.includes(Practitioner) && await Practitioner.exists({ user: res.locals.user.id })) {
      const practitioner = await Practitioner.findOne({ user: res.locals.user.id });

      // Practitioners can only make reqs regarding their own clients
      if (
        res.locals.practitioner
        && req.body.client
        && !await Client.exists({ _id: req.body.client, practitioner: res.locals.practitioner.id })
      ) return res.sendStatus(status.NOT_FOUND);

      res.locals.practitioner = practitioner;
    } else if (permissions.includes(Client) && await Client.exists({ user: res.locals.user.id })) {
      const client = await Client.findOne({ user: res.locals.user.id });

      res.locals.client = client;
    }

    // Reject if no requesting entity
    if (permissions.length
      && !(res.locals.practice || res.locals.practitioner || res.locals.client)
    ) return res.sendStatus(status.UNAUTHORIZED);

    next();
  };
};
