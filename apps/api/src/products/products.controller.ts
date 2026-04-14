import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products with search, category filter, and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.productsService.findAll({ search, categoryId, page, limit });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all product categories' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a product by slug with prices across stores' })
  @ApiQuery({ name: 'cityId', required: false, description: 'Filter prices to a specific city' })
  @ApiQuery({ name: 'stateId', required: false, description: 'Filter prices to a specific state' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('cityId') cityId?: string,
    @Query('stateId') stateId?: string,
  ) {
    return this.productsService.findBySlug(slug, { cityId, stateId });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() data: any) {
    return this.productsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
