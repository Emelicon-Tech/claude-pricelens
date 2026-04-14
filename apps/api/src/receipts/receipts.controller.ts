import { Controller, Post, UseInterceptors, UploadedFile, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Express } from 'express';

@ApiTags('receipts')
@Controller('receipts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Upload a receipt to verify a reported price' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'The receipt image file' },
        productId: { type: 'string', description: 'The product being reported' },
        storeId: { type: 'string', description: 'The store to attach this price to' },
        amount: { type: 'number', description: 'The initial community amount reported' },
      },
      required: ['file', 'productId', 'storeId', 'amount'],
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async scanReceipt(
    @UploadedFile() file: Express.Multer.File,
    @Body('productId') productId: string,
    @Body('storeId') storeId: string,
    @Body('amount') amount: string, // multer bodies arrive as strings
    @CurrentUser('sub') userId: string,
  ) {
    if (!file) throw new BadRequestException('A receipt image is strictly required for verification.');

    return this.receiptsService.processReceiptAndVerifyPrice(
      file,
      productId,
      storeId,
      Number(amount),
      userId
    );
  }
}
