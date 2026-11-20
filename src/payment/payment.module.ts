import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.js';
import { DrizzlePaymentRepository } from './infra/adapters/drizzle-payment.repository.js';
import { StripePaymentAdapter } from './infra/adapters/stripe-payment.adapter.js';
import { PAYMENT_GATEWAY } from './ports/payment-gateway.port.js';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
  ],
})
export class PaymentModule {}
