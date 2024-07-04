import { TransferController } from '@/transfer/transfer.controller';
import { TransferService } from '@/transfer/transfer.service';
import { Web3Module } from '@/web3/web3.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    Web3Module,
  ],
  controllers: [TransferController],
  providers: [TransferService],
})
export class AppModule {}
