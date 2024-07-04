import { Injectable } from '@nestjs/common';
import Web3, { Bytes, Numbers } from 'web3';
import { ConfigService } from '@nestjs/config';
import { Contract } from 'web3-eth-contract';
import SimpleToken from '@truffle/build/contracts/SimpleToken.json';

@Injectable()
export class Web3Adapter {
  private readonly web3: Web3;
  private readonly contract: Contract<any>;
  private readonly wallet: string;
  private readonly privateKey: string;

  constructor(private readonly configService: ConfigService) {
    try {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(
          this.configService.get<string>('GANACHE_URL'),
        ),
      );
      const contractAddress =
        this.configService.get<string>('CONTRACT_ADDRESS');
      this.contract = new this.web3.eth.Contract(
        SimpleToken.abi as any,
        contractAddress,
      );

      this.wallet = this.configService.get<string>('WALLET');
      this.privateKey = this.configService.get<string>('PRIVATE_KEY');
    } catch (error) {
      console.error('Error initializing Web3Adapter', error);
      throw new Error('Error initializing Web3Adapter');
    }

    if (!this.wallet || !this.privateKey) {
      throw new Error('Missing configuration');
    }
  }

  async getBalance(address: string): Promise<string> {
    const balance = (await this.contract.methods
      .balanceOf(address)
      .call()) as Numbers;
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async transferTokens(to: string, amount: number): Promise<Bytes | null> {
    const data = this.contract.methods
      .transfer(to, this.web3.utils.toWei(amount.toString(), 'ether'))
      .encodeABI();

    const nonce = await this.web3.eth.getTransactionCount(
      this.wallet,
      'latest',
    );
    const transaction = {
      to: this.contract.options.address,
      data,
      gas: 2000000,
      nonce,
      gasPrice: await this.web3.eth.getGasPrice(),
    };

    const signedTx = await this.web3.eth.accounts.signTransaction(
      transaction,
      this.privateKey,
    );
    const receipt = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );

    return receipt.transactionHash;
  }
}
