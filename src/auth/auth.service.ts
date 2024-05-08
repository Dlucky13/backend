import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { AuthDto } from 'src/network/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('user not found');
    }

    const passwordMatch = await argon.verify(user.hash, dto.password);

    if (!passwordMatch) {
      throw new ForbiddenException('email/password incorrect');
    }

    return this.signinToken(user.id, user.email);
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          role: 'main',
        },
        select: {
          email: true,
          role: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Prisma constraint Error');
        }
      }
      throw error;
    }
  }

  private async signinToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const data = {
      sub: userId,
      email,
    };

    const secret = this.configService.get('JWT_SECRET');

    const access_token = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
      secret,
    });

    return { access_token };
  }
}
