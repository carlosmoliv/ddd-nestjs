import { Module } from '@nestjs/common';
import { DRIZZLE_CLIENT, DrizzleProvider } from './drizzle.provider.js';

@Module({
  providers: [DrizzleProvider],
  exports: [DRIZZLE_CLIENT],
})
export class DrizzleModule {}
