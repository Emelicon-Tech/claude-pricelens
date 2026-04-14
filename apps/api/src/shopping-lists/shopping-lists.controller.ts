import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ShoppingListsService } from './shopping-lists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Express } from 'express';

@ApiTags('shopping-lists')
@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShoppingListsController {
  constructor(private listsService: ShoppingListsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shopping lists for current user' })
  findAll(@CurrentUser('sub') userId: string) {
    return this.listsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shopping list with items and price breakdown' })
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.listsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shopping list' })
  create(@Body() data: { name: string }, @CurrentUser('sub') userId: string) {
    return this.listsService.create(data.name, userId);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Create shopping list by automatically analyzing an image/doc via AI' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' }, name: { type: 'string' } },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async analyzeList(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @CurrentUser('sub') userId: string,
  ) {
    if (!file) throw new BadRequestException('File is required for AI analysis.');
    return this.listsService.analyzeAndCreateList(file, name || 'AI Imported List', userId);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add an item to a shopping list' })
  addItem(
    @Param('id') listId: string,
    @Body() data: { productId: string; quantity?: number },
    @CurrentUser('sub') userId: string,
  ) {
    return this.listsService.addItem(listId, data, userId);
  }

  @Patch(':id/items/:itemId')
  @ApiOperation({ summary: 'Update a shopping list item (quantity, checked)' })
  updateItem(
    @Param('id') listId: string,
    @Param('itemId') itemId: string,
    @Body() data: { quantity?: number; isChecked?: boolean },
    @CurrentUser('sub') userId: string,
  ) {
    return this.listsService.updateItem(listId, itemId, data, userId);
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Remove an item from a shopping list' })
  removeItem(
    @Param('id') listId: string,
    @Param('itemId') itemId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.listsService.removeItem(listId, itemId, userId);
  }

  @Get(':id/optimize')
  @ApiOperation({ summary: 'Get optimized store recommendation for list (Pro only)' })
  @UseGuards(ProGuard)
  optimize(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.listsService.optimizeList(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shopping list' })
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.listsService.delete(id, userId);
  }
}
