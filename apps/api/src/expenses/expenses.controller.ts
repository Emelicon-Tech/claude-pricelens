import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard, ProGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'List user expenses with filters (Pro only)' })
  @ApiQuery({ name: 'month', required: false, description: 'YYYY-MM format' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('month') month?: string,
    @Query('page') page: number = 1,
  ) {
    return this.expensesService.findAll(userId, { month, page });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get monthly expense summary with category breakdown' })
  @ApiQuery({ name: 'month', required: false })
  getSummary(@CurrentUser('sub') userId: string, @Query('month') month?: string) {
    return this.expensesService.getMonthlySummary(userId, month);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Forecast upcoming expenses using historical data and localized inflation patterns' })
  getForecast(@CurrentUser('sub') userId: string) {
    return this.expensesService.getForecast(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Log a new expense' })
  create(@Body() data: any, @CurrentUser('sub') userId: string) {
    return this.expensesService.create(userId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.expensesService.delete(id, userId);
  }
}
