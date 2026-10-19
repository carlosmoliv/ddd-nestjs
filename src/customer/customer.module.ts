import { Module } from '@nestjs/common';
import { DrizzleCustomerRepository } from './infra/adapters/drizzle-customer.repository.js';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { CustomerController } from './presentation/customer.controller.js';
import { QueryHandlers } from './application/queries/handlers/index.js';
import { ConsoleNotificationAdapter } from './infra/adapters/console-notification.adapter.js';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port.js';
import { EventHandlers } from './application/events/index.js';
import { NodeMailerNotificationAdapter } from './infra/adapters/node-mailer-notification.adapter.js';

@Module({
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NodeMailerNotificationAdapter,
    },
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
