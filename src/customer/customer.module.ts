import { Module } from '@nestjs/common';
import { DrizzleCustomerRepository } from './infra/drizzle-customer.repository.js';
import { CUSTOMER_REPOSITORY } from './application/customer.repository.js';

@Module({
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
  exports: [DrizzleCustomerRepository],
})
export class CustomerModule {}
