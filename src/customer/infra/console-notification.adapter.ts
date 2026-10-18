import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NotificationPort,
  Notification,
} from '../application/ports/notification.port.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../application/ports/customer.repository.js';
import { CustomerId } from '../domain/value-objects/customer-id.vo.js';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );
    const recipient = customer?.email.getValue() ?? notification.recipientId;

    this.logger.log(
      `[${notification.subject}] Sending notification to ${recipient} and message "${notification.message}"`,
    );
  }
}
