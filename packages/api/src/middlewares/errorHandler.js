const { InvalidRequestError } = require('lib/helpers/Error');
const mongoose = require('lib/mongoose');

module.exports = function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError) {
    res.status(400).send({
      error: {
        message: 'Invalid request (check your POST parameters): unable to parse JSON request body',
        type: 'invalid_request_error',
      },
    });
  } else if (err.name === 'MongoError' && err.code === 11000) {
    const [path, value] = Object.entries(err.keyValue)[0];

    res.status(400).send({
      error: {
        param: path,
        message: `Error, expected \`${path}\` to be unique. Value: \`${value}\``,
        type: 'invalid_request_error',
      },
    });
  } else if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({
      error: {
        param: Object.keys(err.errors)[0],
        message: Object.values(err.errors)[0].message,
        type: 'invalid_request_error',
      },
    });
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    console.log(err);
    res.status(400).send({
      error: {
        param: Object.keys(err.keyPattern)[0],
        message: err.message,
        type: 'invalid_request_error',
      },
    });
  } else if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({
      error: {
        param: err.path,
        message: err.message,
        type: 'invalid_request_error',
      },
    });
  } else if (err instanceof InvalidRequestError) {
    res.status(400).send({
      error: {
        message: err.message,
        code: err.code,
        type: 'invalid_request_error',
      },
    });
  } else {
    console.log(err);

    res.status(500).send({
      error: {
        message: 'Something went wrong on our end.',
        type: 'api_error',
      },
    });
  }

  next();
};
