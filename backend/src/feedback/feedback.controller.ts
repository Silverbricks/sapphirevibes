import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Request,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateFeedbackDto,
    @Request() req: { user?: { id: string } },
  ) {
    return this.feedbackService.create(dto, req.user?.id);
  }

  @Get()
  list(
    @Query('target_id') targetId: string,
    @Query('page') page?: number,
    @Query('sort') sort?: 'newest' | 'highest' | 'lowest',
  ) {
    return this.feedbackService.list(targetId, page, sort);
  }

  @Get('summary')
  getSummary(@Query('target_id') targetId: string) {
    return this.feedbackService.getSummary(targetId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'VISIBLE' | 'HIDDEN' | 'FLAGGED',
  ) {
    return this.feedbackService.updateStatus(id, status);
  }
}
