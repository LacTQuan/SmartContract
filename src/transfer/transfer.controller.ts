import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transfer(
    @Body('toWallet') toWallet: string,
    @Body('amount') amount: number,
  ) {
    return await this.transferService.transferTokens(toWallet, amount);
  }

  @Get()
  async getBalance(@Query('wallet') wallet: string) {
    return await this.transferService.getBalance(wallet);
  }
}
