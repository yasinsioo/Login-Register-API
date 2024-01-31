const APIError = require('./../utils/errors.js');

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    console.log(err);
  }
  return res.status(500).json({
    success: false,
    message: 'There is an error occured. Please contact the administrator.',
  });
};
module.exports = errorHandlerMiddleware;
