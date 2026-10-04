import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../domain/exceptions/application.exception.js';
import { Response } from 'express';

const statusCodeMap: Record<string, number> = {
  [ApplicationExceptionCode.ValidationError]: HttpStatus.BAD_REQUEST,
  [ApplicationExceptionCode.NotFoundError]: HttpStatus.NOT_FOUND,
  [ApplicationExceptionCode.ConflictError]: HttpStatus.CONFLICT,
};

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      statusCodeMap[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: exception.code,
    });
  }
}
