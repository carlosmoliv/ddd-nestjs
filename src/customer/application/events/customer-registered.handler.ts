import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerRegisteredEvent } from '../../domain/events/customer-registered.event.js';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../ports/notification.port.js';

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CustomerRegisteredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Welcome aboard!',
      message: `${event.firstName}, your account has been created successfully. Start exploring and personalize your experience.`,
    });
  }
}
