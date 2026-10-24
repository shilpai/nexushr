/**
 * Standard API Response Structure
 */
export class ApiResponse {
  static success(res, data = null, message = 'Operation successful', statusCode = 200, meta = null) {
    const payload = {
      success: true,
      statusCode,
      message,
      data
    };

    if (meta) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const payload = {
      success: false,
      statusCode,
      message
    };

    if (errors) {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }
}
