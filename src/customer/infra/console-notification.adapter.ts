import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationPort,
  Notification,
} from '../application/ports/notification.port.js';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  async sendNotification(notification: Notification): Promise<void> {
    this.logger.log(
      `Sending notification to ${notification.recipient} with subject "${notification.subject}" and message "${notification.message}"`,
    );
  }
}
