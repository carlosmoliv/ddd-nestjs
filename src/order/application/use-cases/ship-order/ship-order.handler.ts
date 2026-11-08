import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ShipOrderCommand } from './ship-order.command.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order.repository.js';
import { OrderId } from '../../../value-objects/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(ShipOrderCommand)
export class ShipOrderHandler implements ICommandHandler<
  ShipOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ShipOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );

    if (!order) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
        ApplicationExceptionCode.NotFoundError,
      );
    }

    const trackedOrder = this.eventPublisher.mergeObjectContext(order);

    trackedOrder.ship(command.trackingNumber);

    await this.orderRepository.save(trackedOrder);

    trackedOrder.commit();
  }
}
