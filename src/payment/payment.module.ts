import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.js';
import { DrizzlePaymentRepository } from './infra/adapters/drizzle-payment.repository.js';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
})
export class PaymentModule {}
