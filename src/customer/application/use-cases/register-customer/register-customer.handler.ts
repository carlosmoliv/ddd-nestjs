import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCustomerCommand } from './register-customer.command.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../ports/customer.repository.js';
import { Inject } from '@nestjs/common';
import { Email } from '../../../domain/value-objects/email.vo.js';
import { Customer } from '../../../domain/entities/customer.entity.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<
  RegisterCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<void> {
    const email = Email.create(command.email);

    const existingCustomer = await this.customerRepository.findByEmail(email);
    if (existingCustomer) {
      throw new ApplicationException(
        `Customer with email ${command.email} already exists`,
        ApplicationExceptionCode.ConflictError,
      );
    }

    const customer = Customer.register(
      email,
      command.firstName,
      command.lastName,
      command.phoneNumber,
    );

    await this.customerRepository.save(customer);
  }
}
