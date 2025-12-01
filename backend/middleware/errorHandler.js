export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    error: err.message || 'Something went wrong',
  };

  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
    payload.details = err.details;
  }

  res.status(statusCode).json(payload);
};

