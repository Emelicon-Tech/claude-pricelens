import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'List stores with filters' })
  @ApiQuery({ name: 'cityId', required: false })
  @ApiQuery({ name: 'stateId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['SUPERMARKET', 'OPEN_MARKET', 'ONLINE'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('cityId') cityId?: string,
    @Query('stateId') stateId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.storesService.findAll({ cityId, stateId, type, search, page, limit });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get store details with product prices' })
  findBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new store (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() data: any) {
    return this.storesService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a store (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.storesService.update(id, data);
  }
}
