import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCustomerQuery } from '../get-customer.query.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';
import { Customer } from '../../../domain/entities/customer.entity.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../ports/customer.repository.js';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo.js';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.id),
    );
    if (!customer) {
      throw new ApplicationException(
        `Customer with ID ${query.id} not found`,
        ApplicationExceptionCode.NotFoundError,
      );
    }
    return customer;
  }
}
