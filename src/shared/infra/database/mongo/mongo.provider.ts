import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

export const MONGO_DB = Symbol('MONGO_DB');

export const MongoProvider = {
  provide: MONGO_DB,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Db> => {
    const mongoUri = configService.getOrThrow<string>('MONGO_URI');
    const dbName = configService.getOrThrow<string>(
      'MONGO_DB_NAME',
      'clean-shop',
    );
    const client = new MongoClient(mongoUri);
    return client.db(dbName);
  },
};
