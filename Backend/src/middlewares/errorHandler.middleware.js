import { ApiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Handle MySQL duplicate key error
  if (err.code === 'ER_DUP_ENTRY') {
    return ApiResponse.badRequest(res, 'A record with this unique value (e.g. Email or Code) already exists.', {
      sqlMessage: err.sqlMessage
    });
  }

  // Handle MySQL foreign key constraint failure
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ApiResponse.badRequest(res, 'Referenced record does not exist.');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

export const notFoundHandler = (req, res) => {
  return ApiResponse.notFound(res, `Route not found: ${req.method} ${req.originalUrl}`);
};
