import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { MongoModule } from './shared/infrastructure/infrestructure/database/mongodb/mongo.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'clean-shop',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
