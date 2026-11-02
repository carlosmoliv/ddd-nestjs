import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOrdersQuery } from '../list-orders.query.js';
import { Order } from '../../domain/order.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../application/ports/order.repository.js';
import { Inject } from '@nestjs/common';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<
  ListOrdersQuery,
  Order[]
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: ListOrdersQuery): Promise<Order[]> {
    if (query.customerId) {
      return this.orderRepository.findByCustomerId(query.customerId);
    }

    return this.orderRepository.findAll();
  }
}
