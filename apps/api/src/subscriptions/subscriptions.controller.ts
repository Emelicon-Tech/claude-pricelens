import { Controller, Post, Body, Get, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get current subscription status' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getStatus(@CurrentUser('sub') userId: string) {
    return this.subscriptionsService.getStatus(userId);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Initialize a subscription payment' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  subscribe(
    @CurrentUser('sub') userId: string,
    @Body() data: { interval: 'MONTHLY' | 'ANNUAL' },
  ) {
    return this.subscriptionsService.initializePayment(userId, data.interval);
  }

  @Get('verify/:reference')
  @ApiOperation({ summary: 'Synchronously verify a completed payment' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  verifyPayment(
    @CurrentUser('sub') userId: string,
    @Param('reference') reference: string,
  ) {
    return this.subscriptionsService.verifyPayment(reference, userId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Paystack webhook handler' })
  handleWebhook(@Body() payload: any, @Req() req: any) {
    return this.subscriptionsService.handleWebhook(payload, req.headers['x-paystack-signature']);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancel(@CurrentUser('sub') userId: string) {
    return this.subscriptionsService.cancel(userId);
  }
}
