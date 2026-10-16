import { Module } from '@nestjs/common';
import { DrizzleCustomerRepository } from './infra/drizzle-customer.repository.js';
import { CUSTOMER_REPOSITORY } from './application/customer.repository.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { CustomerController } from './presentation/customer.controller.js';

@Module({
  providers: [
    ...CommandHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
  controllers: [CustomerController],
})
export class CustomerModule {}
