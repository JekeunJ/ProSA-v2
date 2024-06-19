const status = require('http-status');
const User = require('lib/models/User');

// Retrieve a user
module.exports.retrieveUser = async function retrieveUser(req, res, next) {
  try {
    const user = await User.findOne({
      _id: res.locals.user.id,
    }).populate('client practitioner practices');

    if (!user) return res.sendStatus(status.NOT_FOUND);

    res.send(user.toJSON());
  } catch (err) {
    next(err);
  }
};

// Update a user
module.exports.updateUser = async function updateUser(req, res, next) {
  try {
    const user = await User.findOneAndUpdate({
      _id: res.locals.user.id,
    }, req.body, { runValidators: true, new: true });

    if (!user) return res.sendStatus(status.NOT_FOUND);

    res.send(user.toJSON());
  } catch (err) {
    next(err);
  }
};
