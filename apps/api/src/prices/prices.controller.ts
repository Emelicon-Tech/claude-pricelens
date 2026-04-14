import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PricesService } from './prices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('prices')
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get('compare/:productId')
  @ApiOperation({ summary: 'Compare prices for a product across stores (core feature)' })
  @ApiQuery({ name: 'cityId', required: false })
  @ApiQuery({ name: 'stateId', required: false })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  comparePrices(
    @Param('productId') productId: string,
    @Query('cityId') cityId?: string,
    @Query('stateId') stateId?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.pricesService.comparePrices(productId, { cityId, stateId }, userId);
  }

  @Get('history/:productId/:storeId')
  @ApiOperation({ summary: 'Get price history for a product at a specific store' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getPriceHistory(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
    @Query('days') days: number = 30,
  ) {
    return this.pricesService.getPriceHistory(productId, storeId, days);
  }

  @Get('cheapest')
  @ApiOperation({ summary: 'Get products sorted by cheapest price in a location' })
  @ApiQuery({ name: 'cityId', required: true })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getCheapest(
    @Query('cityId') cityId: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.pricesService.getCheapestProducts(cityId, categoryId, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Add or update a price entry' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RETAILER)
  createPrice(@Body() data: any, @CurrentUser('sub') userId: string) {
    return this.pricesService.createOrUpdate(data, userId);
  }

  @Post('bulk-import')
  @ApiOperation({ summary: 'Bulk import prices from CSV data (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  bulkImport(@Body() data: { prices: any[] }) {
    return this.pricesService.bulkImport(data.prices);
  }
}
