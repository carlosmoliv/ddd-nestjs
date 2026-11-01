import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './place-order.command.js';
import { ShippingAddress } from '../../../value-objects/shipping-address.vo.js';
import { Order } from '../../../domain/order.js';
import { Inject } from '@nestjs/common';
import { OrderItem } from '../../../domain/order-item.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order.repository.js';
import { CUSTOMER, CustomerPort } from '../../ports/customer.port.js';
import { PRODUCT, ProductPort } from '../../ports/product.port.js';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(CUSTOMER)
    private readonly customer: CustomerPort,
    @Inject(PRODUCT)
    private readonly product: ProductPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<any> {
    const customerExists = await this.customer.exists(command.customerId);
    if (!customerExists) {
      throw new ApplicationException(
        `Customer with id ${command.customerId} not found`,
        ApplicationExceptionCode.NotFoundError,
      );
    }

    for (const item of command.items) {
      const productExists = await this.product.exists(item.productId);
      if (!productExists) {
        throw new ApplicationException(
          `Product with id ${item.productId} not found`,
          ApplicationExceptionCode.NotFoundError,
        );
      }
    }

    const items = command.items.map((item) =>
      OrderItem.create(
        item.productId,
        item.productName,
        Money.create(item.unitPrice, item.currency),
        item.quantity,
      ),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      zipCode: command.shippingZipCode,
      country: command.shippingCountry,
    });

    const order = this.eventPublisher.mergeObjectContext(
      Order.place(command.customerId, items, shippingAddress),
    );

    await this.orderRepository.save(order);

    order.commit();
  }
}
