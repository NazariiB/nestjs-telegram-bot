import { Inject, Injectable } from '@nestjs/common';
import { User } from '@user/user.entity';
import {
  Update,
  Ctx,
  Start,
  Help,
  On,
  Hears,
} from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { Web3 } from 'web3';

@Update()
@Injectable()
export class BotUpdate {
  constructor(
    @Inject('USER_REPOSITORY')
    private dbConnection: Repository<User>
  ) { }

  @Start()
  async start(@Ctx() ctx: Context) {
    const user: any[] = await this.dbConnection.query(`select * from user where tg_user_id='${ctx.from.id}'`);
    let message = '';
    if (user?.length) {
      message = 'Hi \nyour address is: ' + user[0].address;
    } else {
      const web3 = new Web3('');
      const newAccount = web3.eth.accounts.create();
      await this.dbConnection.query(
        `insert into user value(default, '${ctx.from.id.toString()}', '${newAccount.address.toLowerCase()}', '${newAccount.privateKey.toLowerCase()}')`
      );
      message = 'Welcome \nyour address is: ' + newAccount.address;
    }
    await ctx.reply(message + '\n to send eth to another address send\n/send "another_address" "percentages"');
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('This bot creates and safes addresses for users and allow them to send eth to another address');
  }

  @On('text')
  async on(@Ctx() ctx: any) {
    const [user] = await this.dbConnection.query(`select * from user where tg_user_id='${ctx.from.id}'`);
    if (!user) {
      await ctx.reply('User not found try /start');
      return;
    }

    const parameters = ctx.update.message.text.split(' ');
    const addressTo = parameters[1];
    const percentage = Number(parameters[2]);

    const providers = process.env.PROVIDERS.split(',');
    await ctx.reply('Processing');

    for (let i = 0; i < providers.length; i++) {
      try {
        const web3 = new Web3(providers[i]);        
        if (!web3.utils.isAddress(addressTo) || typeof percentage !== 'number' || percentage === 0 || Number.isNaN(percentage)) {
          await ctx.reply('Invalid parameters, try again');
          return;
        }

        const balance = await web3.eth.getBalance(user.address);
        if (Number(balance) === 0) {
          await ctx.reply('Your balance is 0');
          return;
        }
        
        const gasPrice = await web3.eth.getGasPrice();

        const transactionObject = {
          from: user.address,
          to: addressTo,
          gasPrice: gasPrice,
        }

        const gasLimit = await web3.eth.estimateGas(transactionObject);
        const transactionFee = gasPrice * gasLimit;
        const nonce = await web3.eth.getTransactionCount(user.address, 'latest');

        const createTransaction = await web3.eth.accounts.signTransaction(
          {
            gas: Number(gasLimit),
            from: user.address,
            to: addressTo,
            gasPrice: Number(gasPrice),
            nonce: Number(nonce),
            value: Math.ceil(Number(balance) * percentage / 100) - Number(transactionFee),
          },
          user.private_key
        );

        const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        await ctx.reply(`Success\nether was successfully transferred\ntxHash:${createReceipt.transactionHash}`);
        return;
      } catch (e) {
        console.log(e);
      }
    }
    await ctx.reply(`Unexpected error happened, try again later`);
  }
}
