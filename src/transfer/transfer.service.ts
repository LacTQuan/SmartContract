import { Injectable } from '@nestjs/common';
import { Web3Adapter } from '@/web3/web3.adapter';

@Injectable()
export class TransferService {
  constructor(private readonly web3Adapter: Web3Adapter) {}

  async transferTokens(toWallet: string, amount: number) {
    return await this.web3Adapter.transferTokens(toWallet, amount);
  }

  async getBalance(wallet: string) {
    return await this.web3Adapter.getBalance(wallet);
  }
}
