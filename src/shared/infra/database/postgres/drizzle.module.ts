import { Global, Module } from '@nestjs/common';
import { DRIZZLE_CLIENT, DrizzleProvider } from './drizzle.provider.js';

@Global()
@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}
