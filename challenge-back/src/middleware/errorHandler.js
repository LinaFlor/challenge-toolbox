

/**
 * Express global error handling middleware.
 * Logs the error and sends a JSON response with status code and details.
 *
 * @param {Error} err - The error object thrown in the app.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function errorHandler(err, req, res, next) {
  console.error(err); // Log for debugging
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    details: err.details || undefined
  });
}
module.exports = errorHandler;