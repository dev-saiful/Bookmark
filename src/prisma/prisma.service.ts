import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({})
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgres://postgres.njvyksvbqutcuhufaryw:sinx+cosx=1@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
        },
      },
    });
  }
}
