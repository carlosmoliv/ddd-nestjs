export enum ApplicationExceptionCode {
  ValidationError = 'ValidationError',
  NotFoundError = 'NotFoundError',
  ConflictError = 'ConflictError',
}

export class ApplicationException extends Error {
  constructor(
    message: string,
    public readonly code: ApplicationExceptionCode,
  ) {
    super(message);
    this.name = 'ApplicationException';
  }
}
