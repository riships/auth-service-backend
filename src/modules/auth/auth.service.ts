import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dtos/create-auth.dto';
import { UpdateAuthDto } from './dtos/update-auth.dto';
import { Role } from './enums/role.enums';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto) {
    const email = createAuthDto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const user: Prisma.UserCreateInput = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      role: createAuthDto.role ?? Role.STUDENT,
      userId: createAuthDto.userId,
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

  findAll() {
    return { message: 'Hello World!' };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    void updateAuthDto;
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
