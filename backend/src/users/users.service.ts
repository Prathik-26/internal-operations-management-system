import { Injectable, ConflictException } from '@nestjs/common';
import { Role } from './enums/role.enum';
import { hashPassword } from '../auth/utils/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor() {
    void this.seedAdmin();
  }

  async seedAdmin(): Promise<void> {
    const password = await hashPassword('password123');

    this.users.push({
      id: '1',
      email: 'admin@test.com',
      passwordHash: password,
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = this.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already exists');

    const hashed = await hashPassword(dto.password);

    const user: User = {
      id: randomUUID(),
      email: dto.email,
      passwordHash: hashed,
      role: dto.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }
}
