import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
  constructor() {
    super({
      datasourceUrl: "postgresql://admin:secret@localhost:5432/p-db?schema=public"
    })
  }
}
