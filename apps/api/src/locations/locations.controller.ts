import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('states')
  @ApiOperation({ summary: 'Get all active states' })
  getStates() {
    return this.locationsService.getStates();
  }

  @Get('states/:stateId/cities')
  @ApiOperation({ summary: 'Get all cities in a state' })
  getCities(@Param('stateId') stateId: string) {
    return this.locationsService.getCitiesByState(stateId);
  }

  @Get('cities/:cityId/stores')
  @ApiOperation({ summary: 'Get all stores in a city' })
  @ApiQuery({ name: 'type', required: false, enum: ['SUPERMARKET', 'OPEN_MARKET', 'ONLINE'] })
  getStoresByCity(
    @Param('cityId') cityId: string,
    @Query('type') type?: string,
  ) {
    return this.locationsService.getStoresByCity(cityId, type);
  }

  @Get('states/:stateId/stores')
  @ApiOperation({ summary: 'Get all stores in a state' })
  @ApiQuery({ name: 'type', required: false, enum: ['SUPERMARKET', 'OPEN_MARKET', 'ONLINE'] })
  getStoresByState(
    @Param('stateId') stateId: string,
    @Query('type') type?: string,
  ) {
    return this.locationsService.getStoresByState(stateId, type);
  }
}
