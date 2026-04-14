import { Module } from '@nestjs/common';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists.service';
import { AuthModule } from '../auth/auth.module';
import { MockAiService } from '../common/ai/mock-ai.service';

@Module({
  imports: [AuthModule],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService, MockAiService],
  exports: [ShoppingListsService],
})
export class ShoppingListsModule {}
