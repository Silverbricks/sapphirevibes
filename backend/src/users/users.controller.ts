import { Controller, Get, Patch, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: { id: string }, @Body() body: any) {
    return this.usersService.update(user.id, body);
  }

  @Get('me/addresses')
  getAddresses(@CurrentUser() user: { id: string }) {
    return this.usersService.getAddresses(user.id);
  }

  @Post('me/addresses')
  createAddress(@CurrentUser() user: { id: string }, @Body() body: any) {
    return this.usersService.createAddress(user.id, body);
  }

  @Patch('me/addresses/:id')
  updateAddress(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() body: any) {
    return this.usersService.updateAddress(id, user.id, body);
  }

  @Delete('me/addresses/:id')
  deleteAddress(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.usersService.deleteAddress(id, user.id);
  }
}
