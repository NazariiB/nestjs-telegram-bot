import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from '@bot.update';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
    }),
    UserModule,
  ],
  controllers: [BotController],
  providers: [BotUpdate],
})
export class BotModule { }
