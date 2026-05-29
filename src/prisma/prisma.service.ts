import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Connected to the database');

    try {
      // 1. Check if the table 'users' exists in the database
      const tableExistsResult = await this.$queryRaw<{ exists: boolean }[]>(
        Prisma.sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
          );
        `,
      );

      if (
        !tableExistsResult ||
        tableExistsResult.length === 0 ||
        !tableExistsResult[0].exists
      ) {
        throw new Error(
          "Table 'users' does not exist in the public schema. " +
            'Please run `npx prisma db push` or migrations to initialize the database.',
        );
      }

      // 2. Check if all required columns exist in the 'users' table
      const columnsResult = await this.$queryRaw<{ column_name: string }[]>(
        Prisma.sql`
          SELECT column_name::text AS column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users';
        `,
      );

      const existingColumns = columnsResult.map((c) => c.column_name);
      const requiredColumns = [
        'id',
        'email',
        'password',
        'role',
        'userId',
        'createdAt',
        'updatedAt',
      ];
      const missingColumns = requiredColumns.filter(
        (col) => !existingColumns.includes(col),
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `Table 'users' is missing required columns: [${missingColumns.join(', ')}]. ` +
            'Please update your database schema using `npx prisma db push` or migrations.',
        );
      }

      console.log(
        'Database schema validation passed: table "users" and all required columns are present.',
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(
        `\x1b[31mCRITICAL DATABASE VALIDATION FAILED: ${errMsg}\x1b[0m`,
      );
      throw new Error(`Database validation failed: ${errMsg}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
