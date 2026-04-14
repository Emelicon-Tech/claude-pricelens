import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { MockAiService } from '../common/ai/mock-ai.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService, MockAiService],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
