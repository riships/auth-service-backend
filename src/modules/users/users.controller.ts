import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ProvisionUserDto } from './dtos/provision-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from './enums/role.enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Provision a new user account (Admin/SuperAdmin only)',
  })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'List all registered user accounts (Admin/SuperAdmin only)',
  })
  @ApiResponse({ status: 200, description: 'List of users returned.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve user profile details (Owner or Admin/SuperAdmin only)',
  })
  @ApiResponse({ status: 200, description: 'User details returned.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: { sub: string; role: Role },
  ) {
    if (
      currentUser.role !== Role.SUPER_ADMIN &&
      currentUser.role !== Role.ADMIN &&
      currentUser.sub !== id
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this profile',
      );
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user profile details (Owner or Admin/SuperAdmin only)',
  })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { sub: string; role: Role },
  ) {
    if (
      currentUser.role !== Role.SUPER_ADMIN &&
      currentUser.role !== Role.ADMIN &&
      currentUser.sub !== id
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this profile',
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account (Admin/SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'Account successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Update your account password (Owner only)' })
  @ApiResponse({ status: 200, description: 'Password successfully updated.' })
  @ApiResponse({ status: 400, description: 'Incorrect old password.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() currentUser: { sub: string; role: Role },
  ) {
    if (currentUser.sub !== id) {
      throw new ForbiddenException('You can only update your own password');
    }
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('provision')
  @ApiOperation({
    summary:
      'Provision a new user account linked to a Student/Teacher/Parent record (Admin/SuperAdmin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully provisioned and linked.',
  })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 409, description: 'Email address already exists.' })
  provision(@Body() provisionUserDto: ProvisionUserDto) {
    return this.usersService.provision(provisionUserDto);
  }
}
