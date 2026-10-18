import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../ports/customer.repository.js';
import { Inject } from '@nestjs/common';
import { ListCustomersQuery } from '../list-customers.query.js';
import { Customer } from '../../../domain/entities/customer.entity.js';

@QueryHandler(ListCustomersQuery)
export class ListCustomerHandler implements IQueryHandler<
  ListCustomersQuery,
  Customer[]
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: ListCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
