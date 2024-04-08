import { Module } from '@nestjs/common';
import { databaseProviders } from './db.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule { }
