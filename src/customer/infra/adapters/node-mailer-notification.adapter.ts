import { Inject, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from '../../application/ports/notification.port.js';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../application/ports/customer.repository.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../shared/domain/exceptions/application.exception.js';

export class NodeMailerNotificationAdapter implements NotificationPort {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly logger = new Logger(NodeMailerNotificationAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow('SMTP_HOST'),
      port: this.configService.getOrThrow('SMTP_PORT'),
      auth: {
        user: this.configService.getOrThrow('SMTP_USER'),
        pass: this.configService.getOrThrow('SMTP_PASSWORD'),
      },
    });
    this.from = this.configService.getOrThrow('SMTP_FROM');
  }

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );
    if (!customer) {
      throw new ApplicationException(
        `User not found ${notification.recipientId}`,
        ApplicationExceptionCode.NotFoundError,
      );
    }
    await this.transporter.sendMail({
      from: this.from,
      to: customer.email.toString(),
      subject: notification.subject,
      html: notification.message,
    });

    this.logger.log(`Email sent to ${customer.email.getValue()}`);
  }
}
