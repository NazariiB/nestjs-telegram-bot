import { Module } from '@nestjs/common';
import { databaseProviders } from './db.provider';

// @Module({
  // imports: [
  //   ConfigModule.forRoot(),
  //   TypeOrmModule.forFeature([User]),
  //   TypeOrmModule.forRoot({
  //     type: 'mysql',
  //     host: process.env.DATABASE_HOST,
  //     port: 3306,
  //     username: process.env.DATABASE_USER,
  //     password: process.env.DATABASE_PASS,
  //     database: process.env.DATABASE_NAME,
  //     synchronize: false,
  //     autoLoadEntities: true,
  //   }),
  // ],
  // providers: [UserRepository],
// })
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule { }
