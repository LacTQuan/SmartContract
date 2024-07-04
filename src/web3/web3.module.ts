import { Module } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Web3Adapter } from '@/web3/web3.adapter';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'Web3',
      useFactory: (configService: ConfigService) => {
        return new Web3(configService.get('GANACHE_URL'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'Config',
      useFactory: (configService: ConfigService) => {
        return {
          wallet: configService.get('WALLET'),
          privateKey: configService.get('PRIVATE_KEY'),
        };
      },
      inject: [ConfigService],
    },
    Web3Adapter,
  ],
  exports: [Web3Adapter],
})
export class Web3Module {}
