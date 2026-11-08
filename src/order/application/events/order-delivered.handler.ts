import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderDeliveredEvent } from '../../domain/events/order-delivered.event.js';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customer/application/ports/notification.port.js';
import { OrderShippedEvent } from '../../domain/events/order-shipped.event.js';

@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderDeliveredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Delivered',
      message: `Your Clean Shop order ${event.orderId} has been delivered.`,
    });
  }
}
