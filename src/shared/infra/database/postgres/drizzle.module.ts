import { Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider.js';

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}
