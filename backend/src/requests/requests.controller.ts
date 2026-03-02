import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { RequestStatus } from './enums/request-status.enum';

@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.requestsService.create(dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  myRequests(@CurrentUser() user: AuthenticatedUser) {
    return this.requestsService.findOwn(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  allRequests() {
    return this.requestsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.requestsService.updateStatus(id, RequestStatus.APPROVED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.requestsService.updateStatus(id, RequestStatus.REJECTED);
  }
}
