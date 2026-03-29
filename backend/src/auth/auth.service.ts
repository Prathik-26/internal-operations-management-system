import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { comparePassword, hashPassword } from './utils/hash.util';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException(
        'No account found with this email address',
      );

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch)
      throw new UnauthorizedException(
        'Incorrect password. Please try again or contact your admin to reset it',
      );

    return user;
  }

  async login(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>(
        'jwt.refreshExpiresIn',
      ) as unknown as import('ms').StringValue,
    });

    const refreshTokenHash = await hashPassword(refreshToken);
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  async refresh(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException(
        'Your session has expired. Please sign in again',
      );
    }

    const isMatch = await comparePassword(refreshToken, user.refreshTokenHash);
    if (!isMatch)
      throw new UnauthorizedException(
        'Your session is no longer valid. Please sign in again',
      );

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
