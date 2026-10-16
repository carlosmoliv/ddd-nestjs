import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command.js';
import { Inject } from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../customer.repository.js';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo.js';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<
  DeleteCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customerId = new CustomerId(command.id);
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new ApplicationException(
        `Customer with ID ${command.id} not found`,
        ApplicationExceptionCode.NotFoundError,
      );
    }
    await this.customerRepository.delete(customerId);
  }
}
