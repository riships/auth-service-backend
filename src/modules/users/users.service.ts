import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ProvisionUserDto } from './dtos/provision-user.dto';
import { Role } from './enums/role.enums';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user: Prisma.UserCreateInput = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      role: createUserDto.role ?? Role.STUDENT,
      userId: createUserDto.userId,
      createdAt: new Date(),
    };

    const createdUser = await this.prisma.user.create({
      data: user,
      omit: { password: true },
    });

    return {
      message: 'User created successfully!',
      status: 201,
      user: createdUser,
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      omit: { password: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const data: Prisma.UserUpdateInput = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
      omit: { password: true },
    });

    return {
      message: 'User updated successfully!',
      user: updatedUser,
    };
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.prisma.user.delete({
      where: { id: user.id },
    });

    return {
      message: 'User deleted successfully!',
    };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Incorrect old password');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      message: 'Password updated successfully!',
    };
  }

  async provision(provisionUserDto: ProvisionUserDto) {
    const email = provisionUserDto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(provisionUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        role: provisionUserDto.role,
        userId: provisionUserDto.entityId, // Link student/teacher/parent ID to userId field
        createdAt: new Date(),
      },
      omit: { password: true },
    });

    return {
      message: `User account successfully provisioned and linked to ${provisionUserDto.entityType}!`,
      user,
    };
  }
}
