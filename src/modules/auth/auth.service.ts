import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dtos/create-auth.dto';
import { UpdateAuthDto } from './dtos/update-auth.dto';
import { Role } from './enums/role.enums';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto) {
    const email = createAuthDto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user: any = {
      id: crypto.randomUUID(),
      email,
      password: createAuthDto.password,
      role: createAuthDto.role ?? Role.STUDENT,
      userId: createAuthDto.userId,
      createdAt: new Date(),
    };
    
    user.password = await bcrypt.hash(user.password, 10);

    await this.prisma.user.create({ data: user });

    const { password, ...createdUser } = user;

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
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
