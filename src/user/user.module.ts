import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/db.module';
import { userProviders } from './user.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...userProviders,
  ],
  exports: [...userProviders],
})
export class UserModule {}
