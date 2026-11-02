import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from '../get-order.query.js';
import { Order } from '../../domain/order.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../application/ports/order.repository.js';
import { Inject } from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../shared/domain/exceptions/application.exception.js';
import { OrderId } from '../../value-objects/order-id.vo.js';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order> {
    const order = await this.orderRepository.findById(new OrderId(query.id));

    if (!order) {
      throw new ApplicationException(
        `Order with ID ${query.id} not found`,
        ApplicationExceptionCode.NotFoundError,
      );
    }

    return order;
  }
}
