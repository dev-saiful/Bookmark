import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Authdto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: Authdto) {
    // user already register or not
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Incorrect email');
    }
    // password verify
    const passMatch = await argon.verify(user.password, dto.password);
    if (!passMatch) {
      throw new ForbiddenException('Incorrect password');
    }

    // return data
    // delete user.password;
    return this.signToken(user.id, user.email);
  }

  async register(dto: Authdto) {
    try {
      // hash password
      const hashpass = await argon.hash(dto.password);
      // save user to db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashpass,
        },
      });
      // delete user.password;
      // return the save user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credientials Taken');
        }
      }

      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtSecret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: jwtSecret,
    });

    return {
      access_token: token,
    };
  }
}
