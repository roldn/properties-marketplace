class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode; // Set the statusCode property
    this.name = this.constructor.name; // Set the error name
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

export const errorHandler = (statusCode: number, message: string) => {
  return new CustomError(statusCode, message);
};
